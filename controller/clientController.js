const express = require("express");
const router = express.Router();
const { Client } = require("../models/ClientSchema");

router.post("/", async (req, res) => {
  let newClient = new Client({ ...req.body });
  const insertedClient = await newClient.save();
  return res.status(201).json(insertedClient);
});

router.get("/", async (req, res) => {
  let result = await Client.find({});
  return res.status(200).json(result);
});

module.exports = router;
