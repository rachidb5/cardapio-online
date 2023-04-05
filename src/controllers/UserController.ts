import { Request, Response } from 'express'
const jwt = require('jsonwebtoken');
require('dotenv').config();

export class UserController {

    login = async (request: Request, response: Response): Promise<Response<any, Record<string, any>>> => {
        try {
            const { userName, password } = request.body;
            const newToken = await jwt.sign({ userName, password }, process.env.JWT_SECRET, { expiresIn: 8*60*60});
            return response.status(200).json({ token: newToken });
          } catch (e) {
            console.log(e);
            return response.status(400).json({ error: e });
          }
    }
}
