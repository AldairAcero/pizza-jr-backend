const express = require("express");
const router = express.Router();
const { Product } = require("./../models/ProductSchema");

router.get("/", async (req, res) => {
  let result = await Product.find();
  res.status(200).json(result);
});

router.get("/paginated", async (req, res) => {
  const pageNumber = req.query.page || 1;
  const pageSize = req.query.size || 10;

  Product.paginate({}, { page: pageNumber, limit: pageSize }, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Error occurred while fetching products." });
    }

    const { docs, total, limit, page, pages } = result;
    res.json({ result: docs, total, limit, page, pages });
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return res.status(400).json({ message: "product not found" });
  return res.status(200).json(product);
});

router.post("/", async (req, res) => {
  let newProduct = new Product({ ...req.body });
  const insertedProduct = await newProduct.save();
  return res.status(201).json(insertedProduct);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return res.status(400).json({ message: "product not found" });
  const result = await Product.findByIdAndUpdate(
    id,
    { ...req.body },
    {
      returnOriginal: false,
    }
  );
  return res.status(201).json(result);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return res.status(400).json({ message: "product not found" });
  const deletedProduct = await Product.findByIdAndDelete(id);
  return res.status(200).json(deletedProduct);
});

module.exports = router;
