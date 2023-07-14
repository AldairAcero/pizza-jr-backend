import db from "./database.js";
import express from "express";
const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  let collection = await db.collection("products");
  let results = await collection.find({}).limit(50).toArray();
  res.send(results).status(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
