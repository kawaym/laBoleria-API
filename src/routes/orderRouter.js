import { Router } from "express";
import {
  createOrder,
  readOrders,
  readOrdersByClient,
} from "../controllers/orderController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import orderSchema from "../schemas/orderSchema.js";

const orderRouter = Router();
orderRouter.post("/order", validateSchemaMiddleware(orderSchema), createOrder);
orderRouter.get("/orders", readOrders);
orderRouter.get("/orders/:id", readOrders);
orderRouter.get("/clients/:id/orders", readOrdersByClient);

export default orderRouter;
