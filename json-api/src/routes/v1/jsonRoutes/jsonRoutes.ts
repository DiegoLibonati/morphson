// @ts-nocheck

import express from "express";
import multer from "multer";

import { jsonControllers } from "@/src/controllers/export";

export const jsonRoutes = express.Router();

const upload = multer();

jsonRoutes
  .get("/inputs", jsonControllers.getJsonInputs)
  .get("/input/:id", jsonControllers.getJsonInput)
  .get("/outputs", jsonControllers.getJsonOutputs)
  .get("/output/:id", jsonControllers.getJsonOutput)
  .post("/upload", jsonControllers.uploadJson)
  .post("/getContent", upload.single("file"), jsonControllers.getFileContent)
  .post("/transform", jsonControllers.transformJson);
