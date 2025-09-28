import { Router } from "express";

import { upload } from "@src/config/multer.config";

import { FileController } from "@src/controllers/file.controller";

const router = Router();

router.post("/content", upload.single("file"), FileController.getContent);

export default router;
