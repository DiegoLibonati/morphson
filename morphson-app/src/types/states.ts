import type { InputJson, Modal, OutputJson } from "@/types/app";

export interface EditorState {
  text: string;
}

export interface JSONState {
  inputJson: InputJson;
  outputJson: OutputJson;
  jsons: {
    inputJsons: InputJson[];
    outputJsons: OutputJson[];
  };
  loading: boolean;
}

export interface ModalState {
  modal: Modal;
}
