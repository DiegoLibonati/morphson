import { InputJson, Modal, OutputJson } from "../entities/entities";

export const MOCK_INPUT_JSON_STATE: InputJson = {
  id: "123",
  content: "content",
  file: null,
  keys: [],
  name: "pipi",
};
export const MOCK_INPUT_JSON_NULL_STATE: InputJson = {
  id: "",
  content: "",
  file: null,
  keys: [],
  name: "",
};
export const MOCK_OUTPUT_JSON_STATE: OutputJson = {
  id: "123",
  model: "content",
  name: "12345",
};
export const MOCK_OUTPUT_JSON_NULL_STATE: OutputJson = {
  id: "",
  model: "",
  name: "",
};

export const MOCK_MODAL_OPEN_STATE: Modal = { message: "1234", open: true };
export const MOCK_MODAL_CLOSE_STATE: Modal = { message: "", open: false };

export const MOCK_RESOLUTION_UPLOADED = "uploaded";

export const MOCK_INPUT_JSONS = [
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
export const MOCK_OUTPUT_JSONS = [
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
