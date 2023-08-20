const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const OrderSchema = new mongoose.Schema(
  {
    products_order: Array,
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    mode: {
      type: String,
      required: true,
    },
    total_order: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
  }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order };
