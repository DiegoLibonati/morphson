import { Router } from "express";

import { TransformController } from "@/controllers/transform.controller";

import { validate } from "@/middlewares/validate.middleware";

import { transformBodySchema } from "@/schemas/transform.schema";

const router = Router();

router.post("/", validate({ body: transformBodySchema }), TransformController.transform);

export default router;
