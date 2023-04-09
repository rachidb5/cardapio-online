import express, { Request, Response, Express } from "express";
import { UserController } from "./controllers/UserController";
import { UserMiddleware } from "./middlewares/userMiddleware";
import { CategoryController } from "./controllers/CategoryController";
import { ProductMiddleware } from "./middlewares/productMiddleware";
import { ProductController } from "./controllers/ProductController";
import { TokenVerification } from "./middlewares/tokenVerification";

const router = express.Router();
const userController = new UserController();
const userMiddleware = new UserMiddleware();
const categoryController = new CategoryController();
const productMiddleware = new ProductMiddleware();
const productController = new ProductController();
const tokenVerification = new TokenVerification();

// Rota de Login
router.post(
  "/auth/login",
  userMiddleware.loginPasswordAuth,
  userController.login
);

// Rota de lista de categoria
router.get(
  "/category",
  tokenVerification.verifyToken,
  categoryController.getCategories
);

//Rotas de produto
router.post(
  "/product",
  tokenVerification.verifyToken,
  productMiddleware.productValidation,
  productMiddleware.verifyCategory,
  productController.createProduct
);
router.get(
  "/product",
  tokenVerification.verifyToken,
  productController.getProducts
);
router.get(
  "/product/:id",
  tokenVerification.verifyToken,
  productMiddleware.productSearch,
  productController.getProductById
);
router.delete(
  "/product/:id",
  tokenVerification.verifyToken,
  productMiddleware.productSearch,
  productController.deleteProduct
);
router.patch(
  "/product/:id",
  tokenVerification.verifyToken,
  productMiddleware.productSearch,
  productMiddleware.productValidation,
  productMiddleware.verifyCategory,
  productController.updateProduct
);

export default router;
