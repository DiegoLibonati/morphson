import { InputJson, OutputJson } from "@src/entities/app";

export type GetJsonInputResponse = {
  code: string;
  message: string;
  data: {
    inputJson: InputJson;
  };
};

export type GetJsonInputsResponse = {
  code: string;
  message: string;
  data: InputJson[];
};

export type GetJsonOutputResponse = {
  code: string;
  message: string;
  data: {
    outputJson: OutputJson;
  };
};

export type GetJsonOutputsResponse = {
  code: string;
  message: string;
  data: OutputJson[];
};

export type PostGetFileContentResponse = {
  code: string;
  message: string;
  content: string;
};

export type PostUploadJsonResponse = {
  code: string;
  message: string;
  data: {
    inputJson: InputJson;
  };
};

export type PostTransformJsonResponse = Blob;
