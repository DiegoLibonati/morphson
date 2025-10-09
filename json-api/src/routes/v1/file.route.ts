import { Router } from "express";

import { upload } from "@src/configs/multer.config";

import { FileController } from "@src/controllers/file.controller";

const router = Router();

router.post("/content", upload.single("file"), FileController.getContent);

export default router;
