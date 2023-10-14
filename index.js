const express = require("express");
const mongoose = require("mongoose");
const PropertiesReader = require("properties-reader");
const properties = PropertiesReader("./app.properties");
const connectionString = properties.get("dbconnection");
const dbname = properties.get("database");
const cors = require("cors");

const productsController = require("./controller/productController");
const userController = require("./controller/userController");
const loginController = require("./controller/loginController");
const orderController = require("./controller/orderController");
const clientController = require("./controller/clientController");

const port = 3001;
const app = express();
const http = require("http");
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

/*CONTROLLERS*/
app.use("/product", productsController);
app.use("/user", userController);
app.use("/login", loginController);
app.use("/order", orderController);
app.use("/client", clientController);

mongoose
  .connect(connectionString + dbname, { useNewUrlParser: true })
  .then(() => {
    console.log("conected to db successful");
    server.listen(port, () => {
      console.log("Server started on port " + port);
    });
  });
