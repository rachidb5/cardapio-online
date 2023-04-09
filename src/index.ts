import app from "./server";
import mongoose from "mongoose";
import { categoryStart, userStart } from "./seeder/dbStarter";
require("dotenv").config();
const port = parseInt(process.env.PORT || "8080");

mongoose
  .connect(process.env.DB_CONN || '')
  .then(() => {
    console.log("conectado");
    userStart();
    categoryStart();
  })
  .catch((e: string) => {
    console.log("algo deu errado erro: " + e);
  });

const server = new app()
  .Start(port)
  .then((port: any) => console.log(`Server running on port ${port}`))
  .catch((error: any) => {
    console.log(error);
    process.exit(1);
  });

export default server;
