import { Router } from "express";

import fileRoutes from "@src/routes/v1/file.route"
import inputRoutes from "@src/routes/v1/input.route"
import outputRoutes from "@src/routes/v1/output.route"
import transformRoutes from "@src/routes/v1/transform.route"

const router = Router();

router.use("/file", fileRoutes);
router.use("/inputs", inputRoutes);
router.use("/outputs", outputRoutes);
router.use("/transform", transformRoutes);

export default router;
