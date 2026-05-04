import { Router } from "express";

import fileRoutes from "@/routes/v1/file.route";
import inputRoutes from "@/routes/v1/input.route";
import outputRoutes from "@/routes/v1/output.route";
import transformRoutes from "@/routes/v1/transform.route";

const router = Router();

router.use("/file", fileRoutes);
router.use("/inputs", inputRoutes);
router.use("/outputs", outputRoutes);
router.use("/transform", transformRoutes);

export default router;
