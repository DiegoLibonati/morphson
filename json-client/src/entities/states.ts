import { InputJson, Modal, OutputJson } from "@src/entities/app";

export type EditorState = {
  text: string;
};

export type JSONState = {
  inputJson: InputJson;
  outputJson: OutputJson;
  jsons: {
    inputJsons: InputJson[];
    outputJsons: OutputJson[];
  };
  loading: boolean;
};

export type ModalState = {
  modal: Modal;
};
