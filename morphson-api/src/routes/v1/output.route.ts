import { Router } from "express";

import { OutputController } from "@/controllers/output.controller";

import { validate } from "@/middlewares/validate.middleware";

import { outputIdParamsSchema } from "@/schemas/output.schema";

const router = Router();

router.get("/", OutputController.getAll);
router.get("/:idOutputJson", validate({ params: outputIdParamsSchema }), OutputController.getById);

export default router;
