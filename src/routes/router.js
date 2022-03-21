import { Router } from "express";

import cakeRouter from "./cakeRouter.js";

const router = Router();
router.use(cakeRouter);

export default router;
