const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const OrderSchema = new mongoose.Schema(
  {
    products_order: Array,
    name: {
      type: String,
      required: true,
    },
    client_address: {
      type: String,
      required: false,
    },
    client_phone: {
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
    repartidor_id: {
      type: String,
      required: false,
    },
    repartidor_name: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      requiered: false,
    },
    orderId: {
      type: Number,
      requiered: false,
    },
  },
  {
    versionKey: false,
  }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order };
