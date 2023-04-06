import User from "../models/UserModel";
import { Request, Response, NextFunction } from "express";

export class UserMiddleware {
  loginPasswordAuth = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    const { userName } = request.body;
    const { password } = request.body;
    const users = await User.find();
    const usersNames = users.filter((user) => user.userName === userName);
    if (usersNames.length < 1 || usersNames[0].password !== password) {
      return response
        .status(401)
        .json({ message: "Usuario ou senha incorretos" });
    }
    next();
  };
}
