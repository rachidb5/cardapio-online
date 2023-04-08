import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
require("dotenv").config();

export class TokenVerification {
  verifyToken = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    try{
      const token = request.headers.authorization;
      if (!token) {
        return response
        .status(401)
        .json({ message: "Unauthorized user" });
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      console.log(e);
      return response.status(400).json({ error: e });
    }
    next();
  };
}
