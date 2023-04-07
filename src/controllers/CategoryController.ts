import { Request, Response } from "express";
import Category from '../models/CategoryModel';

export class CategoryController {
  getCategories = async (
    request: Request,
    response: Response
  ): Promise<Response<any, Record<string, any>>> => {
    try {
      const categories = await Category.find();
      return response.status(200).json(categories);
    } catch (e) {
      console.log(e);
      return response.status(400).json({ error: e });
    }
  };
  
}
