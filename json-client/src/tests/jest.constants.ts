import { InputJson, Modal, OutputJson } from "../entities/entities";

export const mockInputJsonState: InputJson = {
  id: "123",
  content: "content",
  file: null,
  keys: [],
  name: "pipi",
};
export const mockInputJsonNullState: InputJson = {
  id: "",
  content: "",
  file: null,
  keys: [],
  name: "",
};
export const mockOutputJsonState: OutputJson = {
  id: "123",
  model: "content",
  name: "12345",
};
export const mockOutputJsonNullState: OutputJson = {
  id: "",
  model: "",
  name: "",
};

export const mockModalOpenState: Modal = { message: "1234", open: true };
export const mockModalCloseState: Modal = { message: "", open: false };

export const mockResolutionUploaded = "uploaded";

export const mockInputJsons = [
  {
    id: 1,
    name: "asd",
    content: "{'ds': '2as'}",
    keys: [],
    keysAndValues: [],
  },
  {
    id: 2,
    name: "asdasdf",
    content: "{'pe': 'as'}",
    keys: [],
    keysAndValues: [],
  },
];
export const mockOutputJsons = [
  {
    id: 1,
    name: "a2sd",
    model: "{'pe3pe': 'asd'}",
  },
  {
    id: 2,
    name: "asd",
    model: "{'pepe': 'asd'}",
  },
];
