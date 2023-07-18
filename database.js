/*import mongoose from "mongoose";
import PropertiesReader from "properties-reader";
var properties = PropertiesReader("./app.properties");
const connectionString = properties.get("dbconnection");
const dbname = properties.get("database");

mongoose.set("strictQuery", false);

// Define the database URL to connect to.
const mongoDB = connectionString + "/" + dbname;

main().catch((err) => {
  console.log(err);
  console.log("Problem to connect to db!");
});
async function main() {
  await mongoose.connect(mongoDB);
  console.log("Connected!");
}
*/
