import express, { Request, Response, Express } from "express";
import { UserController } from "./controllers/UserController";
import { UserMiddleware } from "./middlewares/userMiddleware";
import { CategoryController } from "./controllers/CategoryController";
import { ProductMiddleware } from "./middlewares/productMiddleware";
import { ProductController } from "./controllers/ProductController";


const router = express.Router();
const userController = new UserController();
const userMiddleware = new UserMiddleware();
const categoryController = new CategoryController()
const productMiddleware = new ProductMiddleware()
const productController = new ProductController()

router.post("/auth/login", userMiddleware.loginPasswordAuth, userController.login);
router.get("/category", categoryController.getCategories);
router.post("/product", productMiddleware.verifyCategory, productController.createProduct)
router.get("/product", productController.getProducts)
router.get("/product/:id", productController.getProductById);
export default router;
