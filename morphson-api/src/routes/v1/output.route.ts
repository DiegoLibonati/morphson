import { Router } from "express";

import { OutputController } from "@/controllers/output.controller";

const router = Router();

router.get("/", OutputController.getAll);
router.get("/:id", OutputController.getById);

export default router;
