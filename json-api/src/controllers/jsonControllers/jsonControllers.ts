import fs from "fs";
import path from "path";

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import {
  getError,
  isInteger,
  getPeers,
  getJsonTransformed,
  isEmptyObject,
} from "@/src/helpers/export";

const prisma = new PrismaClient();

export const jsonControllers = {
  getJsonOutputs: async (req: Request, res: Response): Promise<Response> => {
    try {
      const outputJsons = await prisma.outputJson.findMany();

      return res.status(200).json({
        message: "¡Output jsons successfully delivered!",
        data: outputJsons,
      });
    } catch (e) {
      return res.status(500).json({
        message: getError(e),
      });
    }
  },
  getJsonOutput: async (req: Request, res: Response): Promise<Response> => {
    try {
      const idOutputJson = req.params.id;

      if (!idOutputJson || !isInteger(idOutputJson)) {
        return res.status(400).json({
          message: "You must send a Valid Json Output ID!",
          data: null,
        });
      }

      const outputJson = await prisma.outputJson.findUnique({
        where: {
          id: Number(idOutputJson),
        },
      });

      if (!outputJson) {
        return res.status(400).json({
          message: `The ID: ${idOutputJson} does not exist in our database!`,
          data: null,
        });
      }

      return res.status(200).json({
        message: "¡Output json successfully delivered!",
        data: {
          outputJson: {
            id: outputJson.id,
            name: outputJson.name,
            model: outputJson.model,
          },
        },
      });
    } catch (e) {
      return res.status(500).json({
        message: getError(e),
      });
    }
  },
  getJsonInputs: async (req: Request, res: Response): Promise<Response> => {
    try {
      const inputJsons = await prisma.inputJson.findMany();

      return res.status(200).json({
        message: "¡Input jsons successfully delivered!",
        data: inputJsons,
      });
    } catch (e) {
      return res.status(500).json({
        message: getError(e),
      });
    }
  },
  getJsonInput: async (req: Request, res: Response): Promise<Response> => {
    try {
      const idInputJson = req.params.id;

      if (!idInputJson || !isInteger(idInputJson)) {
        return res.status(400).json({
          message: "You must send a Valid Json Input ID!",
          data: null,
        });
      }

      const inputJson = await prisma.inputJson.findUnique({
        where: {
          id: Number(idInputJson),
        },
      });

      if (!inputJson) {
        return res.status(400).json({
          message: `The ID: ${idInputJson} does not exist in our database!`,
          data: null,
        });
      }

      return res.status(200).json({
        message: "¡Input json successfully delivered!",
        data: {
          inputJson: {
            id: inputJson.id,
            name: inputJson.name,
            content: inputJson.content,
            keys: inputJson.keys,
          },
        },
      });
    } catch (e) {
      return res.status(500).json({
        message: getError(e),
      });
    }
  },
  getFileContent: async (req: Request, res: Response): Promise<Response> => {
    try {
      const file = req.file;
      const content = file!.buffer.toString("utf-8");

      return res.status(200).json({
        message: "¡Successfully obtained the contents of the file!",
        content: content,
      });
    } catch (e) {
      return res.status(500).json({
        message: getError(e),
      });
    }
  },
  uploadJson: async (req: Request, res: Response): Promise<Response> => {
    try {
      const body: { name: string; content: string } = req.body;

      const name = body.name.trim();
      const content = body.content.trim();

      if (!name) {
        return res.status(400).json({
          message: "You must send a valid name!",
        });
      }

      if (!content || content === "{}" || isEmptyObject(content)) {
        return res.status(400).json({
          message: "You must send a JSON with content to be able to transform!",
          data: null,
        });
      }

      const keysAndValues = await getPeers(JSON.parse(body.content));
      const keys = Object.keys(keysAndValues);

      const json = await prisma.inputJson.create({
        data: {
          name: body.name,
          content: body.content,
          keys: keys,
          keysAndValues: JSON.parse(JSON.stringify(keysAndValues)),
        },
      });

      return res.status(201).json({
        message: "¡JSON Uploaded!",
        data: {
          json: json,
        },
      });
    } catch (e: unknown) {
      console.log(e);
      return res.status(500).json({
        message: getError(e),
      });
    }
  },
  transformJson: async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    try {
      const body: Record<string, string | boolean> = req.body;

      const idInputJson = body.idInputJson as string;
      const saveOutputJson = body.saveOutputJson as boolean;
      const outputJsonNameToSave = (body.outputJsonNameToSave as string).trim();
      const contentJsonToTransform = (
        body.contentJsonToTransform as string
      ).trim();

      if (!idInputJson || !isInteger(idInputJson)) {
        return res.status(400).json({
          message: "You must send a Valid Json Input ID!",
          data: null,
        });
      }

      if (saveOutputJson && !outputJsonNameToSave) {
        return res.status(400).json({
          message:
            "If you want to save the model as json output you must enter a valid name!",
          data: null,
        });
      }

      if (
        !contentJsonToTransform ||
        contentJsonToTransform === "{}" ||
        isEmptyObject(contentJsonToTransform)
      ) {
        return res.status(400).json({
          message: "You must send a JSON with content to be able to transform!",
          data: null,
        });
      }

      const inputJson = await prisma.inputJson.findUnique({
        where: {
          id: Number(idInputJson),
        },
      });

      if (!inputJson) {
        return res.status(400).json({
          message: `The ID: ${idInputJson} does not exist in our database!`,
          data: null,
        });
      }

      if (saveOutputJson)
        await prisma.outputJson.create({
          data: {
            name: outputJsonNameToSave,
            model: contentJsonToTransform,
          },
        });

      const jsonTransformed = await getJsonTransformed(
        JSON.parse(contentJsonToTransform),
        inputJson.keys,
        inputJson.keysAndValues as Record<string, unknown>
      );

      const filename = `${inputJson.name}_transformed.json`;
      const filePath = path.join(__dirname, filename);

      fs.writeFileSync(filePath, JSON.stringify(jsonTransformed, null, 2));

      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.setHeader("Content-Type", "application/json");

      return res.status(200).download(filePath, (err) => {
        if (!err) {
          fs.unlinkSync(filePath);
        }
      });
    } catch (e: unknown) {
      return res.status(500).json({
        message: getError(e),
      });
    }
  },
};
