import { InputJson, Modal, OutputJson } from "@src/entities/app";

export const mockInputJsonState: InputJson = {
  id: 123,
  content: { a: "b" },
  keys: ["a"],
  name: "pipi",
  createdAt: "2025-09-27T14:28:34.019Z",
  updatedAt: "2025-09-27T14:28:34.019Z",
  keysAndValues: { a: "b" },
};
export const mockInputJsonNullState: InputJson = {
  id: null,
  content: null,
  keys: [],
  name: "",
  createdAt: null,
  keysAndValues: null,
  updatedAt: null,
};
export const mockOutputJsonState: OutputJson = {
  id: 1234,
  name: "12345",
  transformationModel: { b: "a" },
  createdAt: "2025-09-27T14:28:34.019Z",
  updatedAt: "2025-09-27T14:28:34.019Z",
};
export const mockOutputJsonNullState: OutputJson = {
  id: null,
  name: "",
  transformationModel: null,
  createdAt: null,
  updatedAt: null,
};

export const mockModalOpenState: Modal = { message: "1234", open: true };
export const mockModalCloseState: Modal = { message: "", open: false };

export const mockResolutionUploaded = "uploaded";

export const mockInputJsons = [
  {
    id: 1,
    name: "asd",
    content: { a: "b" },
    keys: [],
    keysAndValues: { a: "b" },
    createdAt: "2025-09-27T14:28:34.019Z",
    updatedAt: "2025-09-27T14:28:34.019Z",
  },
  {
    id: 2,
    name: "asdasdf",
    content: { a: "b" },
    keys: [],
    keysAndValues: { a: "b" },
    createdAt: "2025-09-27T14:28:34.019Z",
    updatedAt: "2025-09-27T14:28:34.019Z",
  },
];
export const mockOutputJsons = [
  {
    id: 1,
    name: "a2sd",
    transformationModel: { b: "a" },
    createdAt: "2025-09-27T14:28:34.019Z",
    updatedAt: "2025-09-27T14:28:34.019Z",
  },
  {
    id: 2,
    name: "asd",
    transformationModel: { b: "a" },
    createdAt: "2025-09-27T14:28:34.019Z",
    updatedAt: "2025-09-27T14:28:34.019Z",
  },
];
