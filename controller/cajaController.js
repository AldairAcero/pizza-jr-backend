const express = require("express");
const router = express.Router();
const constants = require("../util/constants");
const { Caja } = require("../models/CajaSchema");

router.get("/", async (req, res) => {
  let result = await Caja.findOne({ nombre_caja: constants.CAJA_PRINCIPAL });
  res.status(200).json(result);
});

router.put("/", async (req, res) => {
  let caja = await Caja.findOne({ nombre_caja: constants.CAJA_PRINCIPAL });
  let fondo_caja = req.query.fondo_caja || 0;
  if (caja == null) {
    console.log("No existe caja principal, creando");
    caja = new Caja(
      {
        nombre_caja: constants.CAJA_PRINCIPAL,
        fondo_caja: fondo_caja,
        fondo_ventas: 0,
        abierta: false,
      },
      {
        returnOriginal: false,
      }
    );
    await caja.save();
  }
  console.log(caja);
  if (!caja.abierta) {
    console.log("caja cerrada, vamos a abrir");
    let result = await Caja.findOneAndUpdate(
      { nombre_caja: constants.CAJA_PRINCIPAL },
      { abierta: true, fondo_caja: fondo_caja, fondo_ventas: 0 },
      {
        returnOriginal: false,
      }
    );
    console.log(result);
    return res.status(200).json(result);
  } else {
    console.log("caja abierta, vamos a cerrar");
    let result = await Caja.findOneAndUpdate(
      { nombre_caja: constants.CAJA_PRINCIPAL },
      { abierta: false },
      {
        returnOriginal: false,
      }
    );
    console.log(result);
    return res.status(200).json(result);
  }
});

router.post("/venta", async (req, res) => {
  let { total } = req.body;
  let cajaActual = await Caja.findOne({
    nombre_caja: constants.CAJA_PRINCIPAL,
  });
  let newTotal = total + cajaActual.fondo_ventas;
  let result = await Caja.findOneAndUpdate(
    { nombre_caja: constants.CAJA_PRINCIPAL },
    { fondo_ventas: newTotal },
    {
      returnOriginal: false,
    }
  );
  return res.status(200).json(result);
});

module.exports = router;
