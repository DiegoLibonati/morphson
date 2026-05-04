import { Router } from "express";

import { TransformController } from "@/controllers/transform.controller";

const router = Router();

router.post("/", TransformController.transform);

export default router;
