import { Router } from "express";

import cakeRouter from "./cakeRouter.js";
import clientRouter from "./clientRouter.js";

const router = Router();
router.use(cakeRouter);
router.use(clientRouter);

export default router;
