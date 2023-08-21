const express = require("express");
const router = express.Router();
const { Order } = require("./../models/OrderSchema");

router.get("/", async (req, res) => {
  let result = await Order.find();
  res.status(200).json(result);
});

router.post("/", async (req, res) => {
  const orderBody = req.body;
  let newOrder = new Order({ ...orderBody, status: "active" });
  console.log(newOrder);
  let order = await newOrder.save();

  res.status(200).json(order);
});

router.put("/status", async (req, res) => {
  const { _id, status } = req.body;

  const order = await Order.findById(_id);
  if (!order) return res.status(400).json({ message: "order not found" });
  const result = await Order.findByIdAndUpdate(
    _id,
    { status },
    {
      returnOriginal: false,
    }
  );
  return res.status(201).json(result);
});

module.exports = router;
