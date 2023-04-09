import { Request, Response } from "express";
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
      const product = await Product.findById(request.params.id);
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
      await Product.findOneAndDelete({ _id: request.params.id });
      const products = await Product.find();
      return response
        .status(200)
        .json({ message: "Product deleted succesfully", ...products });
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
      let product = await Product.findById(request.params.id);
      let { body } = request
      await Product.findByIdAndUpdate(request.params.id, body);
      product = await Product.findById(request.params.id);
      return response
        .status(201)
        .json({ message: "Product updated succesfully", ...product });
    } catch (e) {
      console.log(e);
      return response.status(400).json({ error: e });
    }
  };
}
