const express = require("express");
const router = express.Router();
const { Order } = require("./../models/OrderSchema");

router.get("/", async (req, res) => {
  const d = new Date().toISOString().slice(0, 10);
  var date = d.replace(/-/g, "/");
  let result = await Order.find({
    date: { $gte: date, $lte: date },
  });
  res.status(200).json(result);
});

router.get("/last", async (req, res) => {
  let result = await Order.findOne().sort({ _id: -1 });
  res.status(200).json(result);
});

router.post("/", async (req, res) => {
  const orderBody = req.body;
  let newOrder = new Order({
    ...orderBody,
    status: "active",
    date: new Date().toISOString().slice(0, 10).replace(/-/g, "/"),
  });
  let order = await newOrder.save();

  res.status(200).json(order);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status, repartidor_id, repartidor_name } = req.body;

  const order = await Order.findById(id);
  if (!order) return res.status(400).json({ message: "order not found" });
  const result = await Order.findByIdAndUpdate(
    id,
    { status, repartidor_id, repartidor_name },
    {
      returnOriginal: false,
    }
  );
  return res.status(200).json(result);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) return res.status(400).json({ message: "order not found" });
  let orderDeleted = await Order.findByIdAndDelete(id);
  return res.status(200).json(orderDeleted);
});

module.exports = router;
