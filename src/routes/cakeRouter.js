import { Router } from "express";
import { createCake } from "../controllers/cakeController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import cakeSchema from "../schemas/cakeSchema.js";

const cakeRouter = Router();
cakeRouter.post("/cakes", validateSchemaMiddleware(cakeSchema), createCake);

export default cakeRouter;
