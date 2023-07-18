const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const ProductShema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      required: true,
    },
    sizes: {
      type: Array,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);
ProductShema.plugin(mongoosePaginate);
const Product = mongoose.model("Product", ProductShema);

module.exports = { Product };
