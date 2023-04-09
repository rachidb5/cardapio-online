import Category from "../models/CategoryModel";
import { Request, Response, NextFunction } from "express";
import Product from "../models/ProductModel";
const jwt = require("jsonwebtoken");
require("dotenv").config();

export class ProductMiddleware {
  verifyCategory = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    try{
      const token = request.headers.authorization;
      if (!token) {
        return response
        .status(401)
        .json({ message: "Usuario não autenticado" });
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const { categories } = request.body;
      const cats = (await Category.find()).map(c => c._id.toString());
      
      for(let i = 0; i<categories.length;i++){
        if(!cats.includes(categories[i])){
          return response.status(400).json({ error: `Category with id: ${categories[i]} doesnt exist` })
        }
      }
    } catch (e) {
      console.log(e);
      return response.status(400).json({ error: e });
    }
    next();
  };

  productSearch = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    try{
      const product = await Product.findById(request.params.id);
      if (product === null) {
        return response.status(404).json({ message: "Product not found" });
      }
    } catch (e) {
      console.log(e);
      return response.status(400).json({ error: e });
    }
    next();
  };
  productValidation = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    try{
      let { body } = request
      if(body.name === '' || body.name === undefined || body.name === null){
        return response.status(400).json({ message: "Invalid Entries." });
      }
      if(body.price === '' || body.price === undefined || body.price === null){
        return response.status(400).json({ message: "Invalid Entries." });
      }
      if(body.qty === '' || body.qty === undefined || body.qty === null){
        return response.status(400).json({ message: "Invalid Entries." });
      }
      if(body.categories.length === 0 || body.categories === undefined || body.categories === null){
        return response.status(400).json({ message: "Invalid Entries." });
      }
    } catch (e) {
      console.log(e);
      return response.status(400).json({ error: e });
    }
    next();
  };

}
