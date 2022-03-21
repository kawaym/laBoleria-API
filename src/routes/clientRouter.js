import { Router } from "express";
import { createClient } from "../controllers/clientController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import clientSchema from "../schemas/clientSchema.js";

const clientRouter = Router();
clientRouter.post(
  "/clients",
  validateSchemaMiddleware(clientSchema),
  createClient
);

export default clientRouter;
