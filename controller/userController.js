const express = require("express");
const router = express.Router();
const { User } = require("./../models/UserSchema");

router.get("/", async (req, res) => {
  let result = await User.find({}, "-password");
  res.status(200).json(result);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(400).json({ message: "usuario no encontrado" });
  return res.status(200).json(user);
});

router.post("/", async (req, res) => {
  const { name, userType, password, phoneNumber } = req.body;

  let u = await User.findOne({ name: name });
  if (u != null)
    return res.status(400).json({ message: "El nombre de usuario ya existe" });
  if (userType == "repartidor") {
    let newUser = new User({ ...req.body });
    const insertedUser = await newUser.save();
    return res.status(201).json(insertedUser);
  }
  const encodedPass = Buffer.from(password).toString("base64");
  let newUser = new User({
    name: name,
    userType: userType,
    password: encodedPass,
    phoneNumber: phoneNumber,
  });
  const insertedUser = await newUser.save();
  return res.status(201).json({
    _id: insertedUser._id,
    name: insertedUser.name,
    phoneNumber: insertedUser.phoneNumber,
    userType: insertedUser.userType,
  });
});

router.post("/repartidor", async (req, res) => {
  const { name } = req.body;

  let u = await User.find({ name: name });
  if (u != null) {
    return res.status(400).json({ message: "El nombre de usuario ya existe" });
  }

  let newUser = new User({ ...req.body });
  const insertedUser = await newUser.save();

  return res.status(201).json(insertedUser);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { phoneNumber, userType } = req.body;
  const user = await User.findById(id);
  if (!user) return res.status(400).json({ message: "usuario no encontrado" });

  const result = await User.findByIdAndUpdate(
    id,
    { phoneNumber: phoneNumber, userType: userType },
    {
      returnOriginal: false,
    }
  );
  return res.status(201).json({
    _id: result._id,
    name: result.name,
    phoneNumber: result.phoneNumber,
    userType: result.userType,
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(400).json({ message: "usuario no encontrado" });
  const deletedUser = await User.findByIdAndDelete(id);
  return res.status(201).json({
    _id: deletedUser._id,
    name: deletedUser.name,
    phoneNumber: deletedUser.phoneNumber,
    userType: deletedUser.userType,
  });
});

module.exports = router;
