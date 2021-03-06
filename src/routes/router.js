import { Router } from "express";

import cakeRouter from "./cakeRouter.js";
import clientRouter from "./clientRouter.js";
import orderRouter from "./orderRouter.js";

const router = Router();
router.use(cakeRouter);
router.use(clientRouter);
router.use(orderRouter);

export default router;
