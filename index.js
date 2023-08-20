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
const port = 3001;
const app = express();

app.use(cors());
app.use(express.json());

/*CONTROLLERS*/

app.use("/product", productsController);
app.use("/user", userController);
app.use("/login", loginController);
app.use("/order", orderController);

const start = async () => {
  try {
    await mongoose.connect(connectionString + dbname);
    app.listen(port, () => console.log("Server started on port " + port));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
