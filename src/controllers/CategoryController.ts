import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
require("dotenv").config();
import Category from '../models/CategoryModel';

export class CategoryController {
  getCategories = async (
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
  };
}
