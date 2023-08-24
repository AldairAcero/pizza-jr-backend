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
const http = require("http");
const { Server } = require("socket.io");
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("connected to ws:" + socket.id);

  socket.on("send_order", (data) => {
    socket.broadcast.emit("send_order", (data));
  });
});

/*CONTROLLERS*/
app.use("/product", productsController);
app.use("/user", userController);
app.use("/login", loginController);
app.use("/order", orderController);

mongoose
  .connect(connectionString + dbname, { useNewUrlParser: true })
  .then(() => {
    console.log("conected to db successful");
    server.listen(port, () => {
      console.log("Server started on port " + port);
    });
  });

/*const start = async () => {
  try {
    await mongoose.connect(connectionString + dbname);
    app.listen(port, () => console.log("Server started on port " + port));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();*/
