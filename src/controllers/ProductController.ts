import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
require("dotenv").config();
import Product from "../models/ProductModel";

export class ProductController {
  
  createProduct = async (
    request: Request,
    response: Response
  ): Promise<Response<any, Record<string, any>>> => {
    try {
      let newProduct = request.body
      await Product.create(newProduct);
      return response.status(201).json({ message:"Product created",...newProduct });
    } catch (e) {
      console.log(e);
      return response.status(400).json({ error: e });
    }
  };
  
  /*getCategories = async (
    request: Request,
    response: Response
  ): Promise<Response<any, Record<string, any>>> => {
    try {
      const token = request.headers.authorization;
      if (!token) {
        return response
          .status(401)
          .json({ message: "Usuario não autenticado" });
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const categories = await Category.find();
      return response.status(200).json(categories);
    } catch (e) {
      console.log(e);
      return response.status(400).json({ error: e });
    }
  };*/
}
