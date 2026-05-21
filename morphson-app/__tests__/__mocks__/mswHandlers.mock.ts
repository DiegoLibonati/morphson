import { http, HttpResponse } from "msw";

import { mockInputJson } from "@tests/__mocks__/inputJson.mock";
import { mockOutputJson } from "@tests/__mocks__/outputJson.mock";

export const mockMswHandlers = [
  http.post("/api/v1/file/content", () => {
    return HttpResponse.json({
      code: "200",
      message: "OK",
      data: '{"key":"value"}',
    });
  }),

  http.get("/api/v1/inputs/", () => {
    return HttpResponse.json({
      code: "200",
      message: "OK",
      data: [mockInputJson],
    });
  }),

  http.get("/api/v1/inputs/:id", ({ params }) => {
    return HttpResponse.json({
      code: "200",
      message: "OK",
      data: { inputJson: { ...mockInputJson, id: Number(params.id) } },
    });
  }),

  http.post("/api/v1/inputs/", async ({ request }) => {
    const body = (await request.json()) as { name: string; content: string };
    return HttpResponse.json({
      code: "201",
      message: "Created",
      data: {
        inputJson: {
          ...mockInputJson,
          name: body.name,
          content: JSON.parse(body.content) as Record<string, unknown>,
        },
      },
    });
  }),

  http.get("/api/v1/outputs/", () => {
    return HttpResponse.json({
      code: "200",
      message: "OK",
      data: [mockOutputJson],
    });
  }),

  http.get("/api/v1/outputs/:id", ({ params }) => {
    return HttpResponse.json({
      code: "200",
      message: "OK",
      data: { outputJson: { ...mockOutputJson, id: Number(params.id) } },
    });
  }),

  http.post("/api/v1/transform/", () => {
    return new HttpResponse(JSON.stringify({ transformed: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
];
