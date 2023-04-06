import app from "./index";
import mongoose from "mongoose";
import { categoryStart, userStart } from "./services/dbStarter";
require("dotenv").config();
const port = parseInt(process.env.PORT || "3000");

mongoose
  .connect(
    `mongodb+srv://jordanrachid:${process.env.DB_PWD}@cluster0.tc6clya.mongodb.net/?retryWrites=true&w=majority`
  )
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
