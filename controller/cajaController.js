const express = require("express");
const router = express.Router();
const constants = require("../util/constants");
const { Caja } = require("../models/CajaSchema");
const { logger } = require("./../util/logger");

router.get("/", async (req, res) => {
  let result = await Caja.find({ nombre_caja: constants.CAJA_PRINCIPAL });
  res.status(200).json(result);
});

router.post("/", async (req, res) => {
  let caja = await Caja.findOne({ nombre_caja: constants.CAJA_PRINCIPAL });
  let fondo_caja = req.query.fondo_caja || 0;
  if (caja == null) {
    logger.info("No existe caja principal, creando");
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

  if (!caja.abierta) {
    logger.info("caja cerrada, vamos a abrir con un fondo de: " + fondo_caja);
    let result = await Caja.findOneAndUpdate(
      { nombre_caja: constants.CAJA_PRINCIPAL },
      { abierta: true, fondo_caja: fondo_caja, fondo_ventas: 0 },
      {
        returnOriginal: false,
      }
    );

    return res.status(200).json([result]);
  } else {
    logger.info(
      "caja abierta, vamos a cerrar con un total de ventas de: " +
        caja.fondo_ventas
    );
    let result = await Caja.findOneAndUpdate(
      { nombre_caja: constants.CAJA_PRINCIPAL },
      { abierta: false },
      {
        returnOriginal: false,
      }
    );

    return res.status(200).json([result]);
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
