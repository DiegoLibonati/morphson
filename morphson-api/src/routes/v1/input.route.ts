import { Router } from "express";

import { InputController } from "@/controllers/input.controller";

import { validate } from "@/middlewares/validate.middleware";

import { inputCreateBodySchema, inputIdParamsSchema } from "@/schemas/input.schema";

const router = Router();

router.get("/", InputController.getAll);
router.get("/:idInputJson", validate({ params: inputIdParamsSchema }), InputController.getById);
router.post("/", validate({ body: inputCreateBodySchema }), InputController.upload);

export default router;
