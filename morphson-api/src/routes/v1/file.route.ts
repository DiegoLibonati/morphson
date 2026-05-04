import { Router } from "express";

import { upload } from "@/configs/multer.config";

import { FileController } from "@/controllers/file.controller";

const router = Router();

router.post("/content", upload.single("file"), FileController.getContent);

export default router;
