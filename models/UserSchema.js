const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: Number,
      required: false,
    },
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = { User };
