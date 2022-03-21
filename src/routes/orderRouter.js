import { Router } from "express";
import { createOrder } from "../controllers/orderController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import orderSchema from "../schemas/orderSchema.js";

const orderRouter = Router();
orderRouter.post("/order", validateSchemaMiddleware(orderSchema), createOrder);

export default orderRouter;
