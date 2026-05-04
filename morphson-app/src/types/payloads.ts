import type { InputJson, OutputJson } from "@/types/app";

export type InputCreatePaylaod = Omit<InputJson, "id" | "createdAt" | "updatedAt">;
export type OutputCreatePaylaod = Omit<OutputJson, "id" | "createdAt" | "updatedAt">;

export interface InputUploadPayload {
  name: string;
  content: string;
}

export interface JsonTransformPayload {
  idInputJson: string;
  saveOutputJson: boolean;
  outputJsonNameToSave: string;
  contentJsonToTransform: string;
}
