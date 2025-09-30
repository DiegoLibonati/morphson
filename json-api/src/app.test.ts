import request from "supertest";

import app from "@src/app";

import {
  mockJsonTransformBody,
  mockJsonUploadBody,
} from "@tests/jest.constants";

import { InputService } from "@src/services/input.service";
import { OutputService } from "@src/services/output.service";

import { getPeers } from "@src/helpers/get_peers.helper";

import {
  MESSAGES_NOT,
  MESSAGES_SUCCESS,
} from "@src/constants/messages.constant";
import { CODES_NOT, CODES_SUCCESS } from "@src/constants/codes.constant";

describe("app.ts", () => {
  afterAll(async () => {
    console.log("Remove all JSON TEST.");

    await InputService.deleteInput(mockJsonUploadBody.name);
    await OutputService.deleteOutput(
      mockJsonTransformBody.outputJsonNameToSave
    );
  });

  describe("General Route", () => {
    const PREFIX_GENERAL = "/api/v1";

    describe(`${PREFIX_GENERAL}/alive`, () => {
      test("It must return the API information.", async () => {
        const response = await request(app).get(`${PREFIX_GENERAL}/alive`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          author: "Diego Libonati",
          name: "JSON-Transformer-API",
          version: "1.1.0",
        });
      });
    });

    describe(`${PREFIX_GENERAL}/INVALID_ROUTE`, () => {
      test("It should return information that the path is invalid or does not exist.", async () => {
        const response = await request(app).get(
          `${PREFIX_GENERAL}/INVALID_ROUTE`
        );

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          code: CODES_NOT.foundRoute,
          message: MESSAGES_NOT.foundRoute,
        });
      });
    });
  });

  describe("File Route", () => {
    const PREFIX_JSON = "/api/v1/file";

    describe(`${PREFIX_JSON}/content`, () => {
      const jsonData = {
        name: "Diego",
        age: 27,
        profession: "Developer",
      };

      const jsonString = JSON.stringify(jsonData);
      const fileBuffer = Buffer.from(jsonString, "utf-8");

      test("It should return the contents of the entered file.", async () => {
        const response = await request(app)
          .post(`${PREFIX_JSON}/content`)
          .attach("file", fileBuffer, "file.json");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          code: CODES_SUCCESS.getFileContent,
          message: MESSAGES_SUCCESS.getFileContent,
          content: jsonString,
        });
      });
    });
  });

  describe("Input Route", () => {
    const PREFIX_JSON = "/api/v1/inputs";

    describe(`${PREFIX_JSON}`, () => {
      test("It must return the list of input jsons.", async () => {
        const response = await request(app).get(`${PREFIX_JSON}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
          expect.objectContaining({
            code: CODES_SUCCESS.getAllInputJsons,
            message: MESSAGES_SUCCESS.getAllInputJsons,
            data: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                keys: expect.arrayContaining([expect.any(String)]),
                content: expect.anything(),
                keysAndValues: expect.anything(),
              }),
            ]),
          })
        );
      });

      test("It must return that a valid name was not entered.", async () => {
        const response = await request(app)
          .post(`${PREFIX_JSON}`)
          .send({ name: "", content: mockJsonUploadBody.content })
          .set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          code: CODES_NOT.validName,
          message: MESSAGES_NOT.validName,
        });
      });

      test("It should return that no valid content was entered.", async () => {
        const response = await request(app)
          .post(`${PREFIX_JSON}`)
          .send({ name: mockJsonUploadBody.name, content: "{}" })
          .set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          code: CODES_NOT.validContent,
          message: MESSAGES_NOT.validContent,
          data: null,
        });
      });

      test("It must return the input json uploaded.", async () => {
        const content = JSON.parse(mockJsonUploadBody.content);

        const keysAndValues = await getPeers(content);
        const keys = Object.keys(keysAndValues);

        const response = await request(app)
          .post(`${PREFIX_JSON}`)
          .send(mockJsonUploadBody)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
          code: CODES_SUCCESS.inputJsonUploaded,
          message: MESSAGES_SUCCESS.inputJsonUploaded,
          data: {
            inputJson: {
              id: expect.any(Number),
              name: mockJsonUploadBody.name,
              content: content,
              keys: keys,
              keysAndValues: keysAndValues,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          },
        });
      });
    });

    describe(`${PREFIX_JSON}/:id`, () => {
      test("It must return a valid ID to be entered.", async () => {
        const response = await request(app).get(`${PREFIX_JSON}/asd`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          code: CODES_NOT.validInputJsonId,
          message: MESSAGES_NOT.validInputJsonId,
          data: null,
        });
      });

      test("It should return that a test with the entered id was not found.", async () => {
        const id = 99;

        const response = await request(app).get(`${PREFIX_JSON}/${id}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          code: CODES_NOT.foundInputJson,
          message: MESSAGES_NOT.foundInputJson,
          data: null,
        });
      });

      test("It must return a json input through an id.", async () => {
        const jsonTest = await InputService.getInputByName(
          mockJsonUploadBody.name
        );

        const response = await request(app).get(
          `${PREFIX_JSON}/${jsonTest?.id}`
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          code: CODES_SUCCESS.getInputJson,
          message: MESSAGES_SUCCESS.getInputJson,
          data: {
            inputJson: {
              id: jsonTest?.id,
              name: jsonTest?.name,
              content: jsonTest?.content,
              keys: jsonTest?.keys,
              keysAndValues: jsonTest?.keysAndValues,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          },
        });
      });
    });
  });

  describe("Transform Route", () => {
    const PREFIX_JSON = "/api/v1/transform";

    describe(`${PREFIX_JSON}`, () => {
      test("It should return that a valid id was not entered.", async () => {
        const response = await request(app)
          .post(`${PREFIX_JSON}`)
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
          code: CODES_NOT.validInputJsonId,
          message: MESSAGES_NOT.validInputJsonId,
          data: null,
        });
      });

      test("It must return that you must send a valid name if you want to save the output json.", async () => {
        const response = await request(app)
          .post(`${PREFIX_JSON}`)
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
          code: CODES_NOT.validName,
          message: MESSAGES_NOT.validName,
          data: null,
        });
      });

      test("It should return that you must enter a valid content to save a json output.", async () => {
        const response = await request(app)
          .post(`${PREFIX_JSON}`)
          .send({
            idInputJson: 1,
            saveOutputJson: true,
            outputJsonNameToSave: mockJsonTransformBody.outputJsonNameToSave,
            contentJsonToTransform: "{}",
          })
          .set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          code: CODES_NOT.validContent,
          message: MESSAGES_NOT.validContent,
          data: null,
        });
      });

      test("It should return that an id was entered that does not exist in the database.", async () => {
        const id = 99;

        const response = await request(app)
          .post(`${PREFIX_JSON}`)
          .send({
            idInputJson: id,
            saveOutputJson: true,
            outputJsonNameToSave: mockJsonTransformBody.outputJsonNameToSave,
            contentJsonToTransform:
              mockJsonTransformBody.contentJsonToTransform,
          })
          .set("Content-Type", "application/json");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          code: CODES_NOT.foundInputJson,
          message: MESSAGES_NOT.foundInputJson,
          data: null,
        });
      });

      test("It must return the transformed file.", async () => {
        const testInputJson = await InputService.getInputByName(
          mockJsonUploadBody.name
        );

        const response = await request(app)
          .post(`${PREFIX_JSON}`)
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
  });

  describe("Output Route", () => {
    const PREFIX_JSON = "/api/v1/outputs";

    describe(`${PREFIX_JSON}`, () => {
      test("It must return the list of output jsons.", async () => {
        const response = await request(app).get(`${PREFIX_JSON}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          code: CODES_SUCCESS.getAllOutputJsons,
          message: MESSAGES_SUCCESS.getAllOutputJsons,
          data: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              transformationModel: expect.anything(),
            }),
          ]),
        });
      });
    });

    describe(`${PREFIX_JSON}/:id`, () => {
      test("It must return a valid ID to be entered.", async () => {
        const response = await request(app).get(`${PREFIX_JSON}/asd`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          code: CODES_NOT.validOutputJsonId,
          message: MESSAGES_NOT.validOutputJsonId,
          data: null,
        });
      });

      test("It should return that a test with the entered id was not found.", async () => {
        const id = 99;

        const response = await request(app).get(`${PREFIX_JSON}/${id}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          code: CODES_NOT.foundOutputJson,
          message: MESSAGES_NOT.foundOutputJson,
          data: null,
        });
      });

      test("It must return a json output through an id.", async () => {
        const jsonTest = await OutputService.getOutputByName(
          mockJsonTransformBody.outputJsonNameToSave
        );

        const response = await request(app).get(
          `${PREFIX_JSON}/${jsonTest?.id}`
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          code: CODES_SUCCESS.getOutputJson,
          message: MESSAGES_SUCCESS.getOutputJson,
          data: {
            outputJson: {
              id: jsonTest?.id,
              name: jsonTest?.name,
              transformationModel: jsonTest?.transformationModel,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          },
        });
      });
    });
  });
});
