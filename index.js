const express = require("express");
const mongoose = require("mongoose");
const PropertiesReader = require("properties-reader");
var properties = PropertiesReader("./app.properties");
const connectionString = properties.get("dbconnection");
const dbname = properties.get("database");
const { Product } = require("./models/ProductSchema");

const app = express();
app.use(express.json());
const port = 3000;

app.get("/", async (req, res) => {
  res.send("Juan joto").status(200);
});

app.get("/product", async (req, res) => {
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

app.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return res.status(400).json({ message: "product not found" });
  return res.status(200).json(product);
});

app.post("/product", async (req, res) => {
  let newProduct = new Product({ ...req.body });
  const insertedProduct = await newProduct.save();
  return res.status(201).json(insertedProduct);
});

app.put("/product/:id", async (req, res) => {
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

app.delete("/product/:id", async (req, res) => {
  const { id } = req.params;
  if (!product) return res.status(400).json({ message: "product not found" });
  const deletedProduct = await Product.findByIdAndDelete(id);
  return res.status(200).json(deletedProduct);
});

const start = async () => {
  try {
    await mongoose.connect(connectionString + dbname);
    app.listen(3000, () => console.log("Server started on port 3000"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
