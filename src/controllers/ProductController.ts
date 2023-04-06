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
      let newProduct = request.body;
      await Product.create(newProduct);
      return response
        .status(201)
        .json({ message: "Product created", ...newProduct });
    } catch (e) {
      console.log(e);
      return response.status(400).json({ error: e });
    }
  };

  getProducts = async (
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
      const products = await Product.find();
      return response.status(200).json(products);
    } catch (e) {
      console.log(e);
      return response.status(400).json({ error: e });
    }
  };

  getProductById = async (
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
      const product = await Product.findById(request.params.id);
      if (product === null) {
        return response.status(404).json({ message: "Product not found" });
      }
      return response.status(200).json(product);
    } catch (e) {
      console.log(e);
      return response.status(400).json({ error: e });
    }
  };

  deleteProduct = async (
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
      const product = await Product.findById(request.params.id);
      if (product === null) {
        return response.status(404).json({ message: "Product not found" });
      }
      await Product.findOneAndDelete({ _id: request.params.id });
      const products = await Product.find();      
      return response.status(200).json({ message: "Productdeleted succesfully",...products });
    } catch (e) {
      console.log(e);
      return response.status(400).json({ error: e });
    }
  };

  updateProduct = async (
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
      const product = await Product.findById(request.params.id);
      if (product === null) {
        return response.status(404).json({ message: "Product not found" });
      }
      await Product.findOneAndDelete({ _id: request.params.id });
      const products = await Product.find();      
      return response.status(200).json({ message: "Productdeleted succesfully",...products });
    } catch (e) {
      console.log(e);
      return response.status(400).json({ error: e });
    }
  };
}
