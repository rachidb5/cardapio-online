import express, { Request, Response, Express } from "express";
import { UserController } from "./controllers/UserController";
import { UserValidator } from "./middlewares/userMiddleware";

const router = express.Router();
const userController = new UserController();
const userValidator = new UserValidator();

router.post("/auth/login", userValidator.loginPasswordAuth, userController.login);

export default router;
