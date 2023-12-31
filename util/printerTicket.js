const http = require("http");
const { Image } = require("canvas");
const { createCanvas } = require("canvas");
const canvas = createCanvas(200, 200);
const ctx = canvas.getContext("2d");
let EscPosEncoder = require("esc-pos-encoder");
const constants = require("../util/constants");
const axios = require("axios");

const { logger } = require("./logger");

logger.info("printer-ticket set up");

const img = new Image();
img.onload = () => ctx.drawImage(img, 0, 0);
img.onerror = (err) => {
  logger.error("error load img");
  throw err;
};
img.src = "./loogo.png";

const getOrderEncoded = (order) => {
  let encoder = new EscPosEncoder();
  let line = "-------------------------------------------";
  let date = new Date();
  let tipoOrdenString = order.mode;

  if (order.mode == constants.ORDER_MODE_DOMICILIO) {
    tipoOrdenString + "->" + order.domicilio + "-" + order.telefono;
  }

  encoder
    .initialize()
    .newline()
    .newline()
    .newline()
    .align("center")
    .image(img, 240, 240, "atkinson")
    .newline()
    .line("Jr Pizza")
    .line("Blvd. Industria 526-A, 47253 Villa Hidalgo, Jal.")
    .line("495-968-3184")
    .line("495-133-87-99")
    .newline()
    .line(line)
    .line(date.toLocaleTimeString() + " " + date.toDateString())
    .line(line)
    .align("left")
    .bold()
    .line("Orden: " + order.orderId)
    .bold()
    .line("cliente: " + order.name)
    .line("tipo orden: " + order.mode)
    .align("center")
    .line(line)
    .align("left")
    .line("Producto                              Subtotal");

  order.products_order.forEach((product, index) => {
    index = index + 1;
    encoder.line(index + ". " + product.name + " .... " + product.price);

    product.extras?.forEach((extra) => {
      encoder.line(extra.name + " ................... " + extra.price);
    });
    encoder
      .bold()
      .line("->NOTAS " + product.notes)
      .bold()
      .align("center")
      .line(line)
      .align("left");
  });

  encoder
    .newline()
    .newline()
    .align("center")
    .line(line)
    .align("right")
    .bold()
    .width(2)
    .height(2)
    .line("Total: " + order.total_order)
    .bold()
    .align("center")
    .width(1)
    .height(1)
    .line(line)
    .newline()
    .newline()
    .line("Gracias por su compra!")
    .newline()
    .newline()
    .newline()
    .cut();

  return encoder.encode();
};

const printOrder = (order, printerName) => {
  let result = getOrderEncoded(order, img);
  let buf = Buffer.from(result.buffer);
  let binData = buf.toString("base64");

  const data = JSON.stringify({
    printer: printerName,
    data: binData,
    id: "testId",
  });

  axios
    .post("http://localhost:9100", data)
    .then((res) => {
      logger.info("impresion status " + printerName + ": " + res.status);
    })
    .catch((err) => {
      logger.error(err);
    });
};

module.exports = { printOrder };
