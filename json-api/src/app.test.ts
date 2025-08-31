import request from "supertest";

import { PrismaClient } from "@prisma/client";

import app from "./app";

import {
  mockJsonTransformBody,
  mockJsonUploadBody,
} from "../tests/jest.constants";

import { getPeers } from "./helpers/getPeers";

describe("app.ts", () => {
  const prisma = new PrismaClient();

  afterAll(async () => {
    console.log("Remove all JSON TEST.");

    console.log(
      "JSON INPUT BEFORE DELETE: ",
      await prisma.inputJson.findUnique({
        where: {
          name: mockJsonUploadBody.name,
          content: mockJsonUploadBody.content,
        },
      })
    );

    console.log(
      "JSON OUTPUT BEFORE DELETE: ",
      await prisma.outputJson.findUnique({
        where: {
          name: mockJsonTransformBody.outputJsonNameToSave,
          model: mockJsonTransformBody.contentJsonToTransform,
        },
      })
    );

    await prisma.inputJson.delete({
      where: {
        name: mockJsonUploadBody.name,
        content: mockJsonUploadBody.content,
      },
    });

    await prisma.outputJson.delete({
      where: {
        name: mockJsonTransformBody.outputJsonNameToSave,
        model: mockJsonTransformBody.contentJsonToTransform,
      },
    });

    console.log(
      "JSON INPUT AFTER DELETE: ",
      await prisma.inputJson.findUnique({
        where: {
          name: mockJsonUploadBody.name,
          content: mockJsonUploadBody.content,
        },
      })
    );

    console.log(
      "JSON OUTPUT BEFORE DELETE: ",
      await prisma.outputJson.findUnique({
        where: {
          name: mockJsonTransformBody.outputJsonNameToSave,
          model: mockJsonTransformBody.contentJsonToTransform,
        },
      })
    );
  });

  describe("GENERAL Route", () => {
    const PREFIX_GENERAL = "/api/v1";

    describe(`${PREFIX_GENERAL}/alive`, () => {
      test("It must return the API information.", async () => {
        const response = await request(app).get(`${PREFIX_GENERAL}/alive`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          author: "Diego Libonati",
          name: "JSON-Transformer-API",
          version: "0.0.1",
        });
      });
    });

    describe(`${PREFIX_GENERAL}/INVALID_ROUTE`, () => {
      test("It should return information that the path is invalid or does not exist.", async () => {
        const response = await request(app).get(
          `${PREFIX_GENERAL}/INVALID_ROUTE`
        );

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Route not found" });
      });
    });
  });

  describe("JSON Route", () => {
    const PREFIX_JSON = "/api/v1/json";

    describe(`${PREFIX_JSON}/upload`, () => {
      test("It must return that a valid name was not entered.", async () => {
        const response = await request(app)
          .post(`${PREFIX_JSON}/upload`)
          .send({ name: "", content: mockJsonUploadBody.content })
          .set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: "You must send a valid name!",
        });
      });

      test("It should return that no valid content was entered.", async () => {
        const response = await request(app)
          .post(`${PREFIX_JSON}/upload`)
          .send({ name: mockJsonUploadBody.name, content: "{}" })
          .set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: "You must send a JSON with content to be able to transform!",
          data: null,
        });
      });

      test("It must return the input json uploaded.", async () => {
        const keysAndValues = await getPeers(
          JSON.parse(mockJsonUploadBody.content)
        );
        const keys = Object.keys(keysAndValues);

        const response = await request(app)
          .post(`${PREFIX_JSON}/upload`)
          .send(mockJsonUploadBody)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
          message: "¡JSON Uploaded!",
          data: {
            json: {
              id: expect.any(Number),
              name: mockJsonUploadBody.name,
              content: mockJsonUploadBody.content,
              keys: keys,
              keysAndValues: keysAndValues,
            },
          },
        });
      });
    });

    describe(`${PREFIX_JSON}/inputs`, () => {
      test("It must return the list of input jsons.", async () => {
        const response = await request(app).get(`${PREFIX_JSON}/inputs`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          message: "¡Input jsons successfully delivered!",
          data: await prisma.inputJson.findMany(),
        });
      });
    });

    describe(`${PREFIX_JSON}/input/:id`, () => {
      test("It must return a valid ID to be entered.", async () => {
        const response = await request(app).get(`${PREFIX_JSON}/input/asd`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: "You must send a Valid Json Input ID!",
          data: null,
        });
      });

      test("It should return that a test with the entered id was not found.", async () => {
        const id = 99;

        const response = await request(app).get(`${PREFIX_JSON}/input/${id}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: `The ID: ${id} does not exist in our database!`,
          data: null,
        });
      });

      test("It must return a json input through an id.", async () => {
        const jsonTest = await prisma.inputJson.findUnique({
          where: {
            name: mockJsonUploadBody.name,
            content: mockJsonUploadBody.content,
          },
        });

        const response = await request(app).get(
          `${PREFIX_JSON}/input/${jsonTest?.id}`
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          message: "¡Input json successfully delivered!",
          data: {
            inputJson: {
              id: jsonTest?.id,
              name: jsonTest?.name,
              content: jsonTest?.content,
              keys: jsonTest?.keys,
            },
          },
        });
      });
    });

    describe(`${PREFIX_JSON}/getContent`, () => {
      const jsonData = {
        name: "Diego",
        age: 26,
        profession: "Developer",
      };

      const jsonString = JSON.stringify(jsonData);
      const fileBuffer = Buffer.from(jsonString, "utf-8");

      test("It should return the contents of the entered file.", async () => {
        const response = await request(app)
          .post(`${PREFIX_JSON}/getContent`)
          .attach("file", fileBuffer, "file.json");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          message: "¡Successfully obtained the contents of the file!",
          content: jsonString,
        });
      });
    });

    describe(`${PREFIX_JSON}/transform`, () => {
      test("It should return that a valid id was not entered.", async () => {
        const response = await request(app)
          .post(`${PREFIX_JSON}/transform`)
          .send({
            idInputJson: "asd",
            saveOutputJson: false,
            outputJsonNameToSave: mockJsonTransformBody.outputJsonNameToSave,
            contentJsonToTransform:
              mockJsonTransformBody.contentJsonToTransform,
          })
          .set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: "You must send a Valid Json Input ID!",
          data: null,
        });
      });

      test("It must return that you must send a valid name if you want to save the output json.", async () => {
        const response = await request(app)
          .post(`${PREFIX_JSON}/transform`)
          .send({
            idInputJson: 1,
            saveOutputJson: true,
            outputJsonNameToSave: "",
            contentJsonToTransform:
              mockJsonTransformBody.contentJsonToTransform,
          })
          .set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message:
            "If you want to save the model as json output you must enter a valid name!",
          data: null,
        });
      });

      test("It should return that you must enter a valid content to save a json output.", async () => {
        const response = await request(app)
          .post(`${PREFIX_JSON}/transform`)
          .send({
            idInputJson: 1,
            saveOutputJson: true,
            outputJsonNameToSave: mockJsonTransformBody.outputJsonNameToSave,
            contentJsonToTransform: "{}",
          })
          .set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: "You must send a JSON with content to be able to transform!",
          data: null,
        });
      });

      test("It should return that an id was entered that does not exist in the database.", async () => {
        const id = 99;

        const response = await request(app)
          .post(`${PREFIX_JSON}/transform`)
          .send({
            idInputJson: id,
            saveOutputJson: true,
            outputJsonNameToSave: mockJsonTransformBody.outputJsonNameToSave,
            contentJsonToTransform:
              mockJsonTransformBody.contentJsonToTransform,
          })
          .set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: `The ID: ${id} does not exist in our database!`,
          data: null,
        });
      });

      test("It must return the transformed file.", async () => {
        const testInputJson = await prisma.inputJson.findUnique({
          where: {
            name: mockJsonUploadBody.name,
            content: mockJsonUploadBody.content,
          },
        });

        const response = await request(app)
          .post(`${PREFIX_JSON}/transform`)
          .send({
            idInputJson: testInputJson?.id,
            saveOutputJson: true,
            outputJsonNameToSave: mockJsonTransformBody.outputJsonNameToSave,
            contentJsonToTransform:
              mockJsonTransformBody.contentJsonToTransform,
          })
          .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        expect(response.headers["content-disposition"]).toContain("attachment");
      });
    });

    describe(`${PREFIX_JSON}/outputs`, () => {
      test("It must return the list of output jsons.", async () => {
        const response = await request(app).get(`${PREFIX_JSON}/outputs`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          message: "¡Output jsons successfully delivered!",
          data: await prisma.outputJson.findMany(),
        });
      });
    });

    describe(`${PREFIX_JSON}/output/:id`, () => {
      test("It must return a valid ID to be entered.", async () => {
        const response = await request(app).get(`${PREFIX_JSON}/output/asd`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: "You must send a Valid Json Output ID!",
          data: null,
        });
      });

      test("It should return that a test with the entered id was not found.", async () => {
        const id = 99;

        const response = await request(app).get(`${PREFIX_JSON}/output/${id}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: `The ID: ${id} does not exist in our database!`,
          data: null,
        });
      });

      test("It must return a json output through an id.", async () => {
        const jsonTest = await prisma.outputJson.findUnique({
          where: {
            name: mockJsonTransformBody.outputJsonNameToSave,
            model: mockJsonTransformBody.contentJsonToTransform,
          },
        });

        const response = await request(app).get(
          `${PREFIX_JSON}/output/${jsonTest?.id}`
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          message: "¡Output json successfully delivered!",
          data: {
            outputJson: {
              id: jsonTest?.id,
              name: jsonTest?.name,
              model: jsonTest?.model,
            },
          },
        });
      });
    });
  });
});
