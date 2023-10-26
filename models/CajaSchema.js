const mongoose = require("mongoose");

const CajaSchema = new mongoose.Schema(
  {
    nombre_caja: {
      type: String,
      required: true,
    },
    fondo_caja: {
      type: Number,
      required: true,
    },
    fondo_ventas: {
      type: Number,
      required: true,
    },
    abierta: {
      type: Boolean,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Caja = mongoose.model("Caja", CajaSchema);

module.exports = { Caja };
