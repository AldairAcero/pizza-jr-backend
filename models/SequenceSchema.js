const mongoose = require("mongoose");

const SequenceSchema = new mongoose.Schema(
  {
    sequence: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Sequence = mongoose.model("Sequence", SequenceSchema);

module.exports = { Sequence };
