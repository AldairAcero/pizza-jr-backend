const express = require("express");
const router = express.Router();
const { User } = require("./../models/UserSchema");
const { logger } = require("./../util/logger");

router.post("/", async (req, res) => {
  let { phoneNumber, password } = { ...req.body };
  let user = await User.findOne(
    {
      phoneNumber: phoneNumber,
      password: Buffer.from(password).toString("base64"),
    },
    "-password"
  );
  if (user != null) {
    logger.info("login usuario: " + user.name);
    return res.status(200).json(user);
  }
  logger.info("intento de login usuario: " + phoneNumber);
  return res.status(400).json({ message: "Credenciales incorrectas" });
});

module.exports = router;
