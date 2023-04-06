import express, { Request, Response, Express } from "express";
import { UserController } from "./controllers/UserController";
import { UserValidator } from "./middlewares/userMiddleware";
import { CategoryController } from "./controllers/CategoryController";


const router = express.Router();
const userController = new UserController();
const userValidator = new UserValidator();
const categoryController = new CategoryController()

router.post("/auth/login", userValidator.loginPasswordAuth, userController.login);
router.get("/category", categoryController.getCategories)
export default router;
