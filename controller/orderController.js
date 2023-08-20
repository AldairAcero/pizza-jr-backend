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

module.exports = router;
