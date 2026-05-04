import { Router } from "express";

import { InputController } from "@/controllers/input.controller";

const router = Router();

router.get("/", InputController.getAll);
router.get("/:id", InputController.getById);
router.post("/", InputController.upload);

export default router;
