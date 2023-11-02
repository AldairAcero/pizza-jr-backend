const express = require("express");
const router = express.Router();
const { Order } = require("./../models/OrderSchema");
const { getLastSequenceToday } = require("../util/Sequence");
const { printOrder } = require("../util/printerTicket");
const constants = require("../util/constants");

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
    status: constants.ACTIVE_ORDER,
    date: new Date().toISOString().slice(0, 10).replace(/-/g, "/"),
    orderId: await getLastSequenceToday(),
  });
  let order = await newOrder.save();
  printOrder(order, constants.PRINTER_1);
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

router.get("/sales", async (req, res) => {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  let result = await Order.find({
    date: { $gte: startDate, $lte: endDate },
    status: constants.DONE_ORDER,
  });
  res.status(200).json(result);
});

router.get("/stats/mode", async (req, res) => {
  const d = new Date().toISOString().slice(0, 10);
  var date = d.replace(/-/g, "/");
  var d2 = new Date(date);

  let result = await Order.aggregate()
    .match({
      status: constants.DONE_ORDER,
      date: {
        $gte: d2,
        $lte: d2,
      },
    })
    .group({
      _id: "$mode",
      count: {
        $sum: 1,
      },
    })
    .project({
      _id: 0,
      mode: "$_id",
      count: 1,
    })
    .sort({ count: -1 });

  return res.status(200).json(result);
});

router.get("/stats/repartidor", async (req, res) => {
  const d = new Date().toISOString().slice(0, 10);
  var date = d.replace(/-/g, "/");
  var d2 = new Date(date);

  let result = await Order.aggregate()
    .match({
      repartidor_name: { $ne: "" },
      mode: constants.ORDER_MODE_DOMICILIO,
      status: constants.DONE_ORDER,
      date: {
        $gte: d2,
        $lte: d2,
      },
    })
    .group({
      _id: "$repartidor_name",
      count: {
        $sum: 1,
      },
    })
    .project({
      _id: 0,
      repartidor_name: "$_id",
      count: 1,
    })
    .sort({ count: -1 })
    .limit(5);

  return res.status(200).json(result);
});

router.get("/stats/best-products", async (req, res) => {
  const d = new Date().toISOString().slice(0, 10);
  var date = d.replace(/-/g, "/");
  var d2 = new Date(date);

  let result = await Order.aggregate()
    .match({
      status: constants.DONE_ORDER,
    })
    .unwind({
      path: "$products_order",
    })
    .group({
      _id: "$products_order.name",
      count: {
        $sum: 1,
      },
    })
    .project({
      _id: 0,
      count: 1,
      product: "$_id",
    })
    .sort({
      count: -1,
    })
    .limit(5);

  return res.status(200).json(result);
});

module.exports = router;
