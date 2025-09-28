import { CSSProperties } from "react";

// **** GENERAL ****

export type InputJson = {
  id: number | null;
  name: string;
  content: Record<string, unknown> | null;
  keys: string[];
  keysAndValues: Record<string, unknown> | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type InputJsonFlat = Omit<InputJson, "id" | "createdAt" | "updatedAt">;

export type OutputJson = {
  id: number | null;
  name: string;
  transformationModel: Record<string, unknown> | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type OutputJsonFlat = Omit<OutputJson, "id" | "createdAt" | "updatedAt">;

export type Modal = {
  message: string;
  open: boolean;
};

export type Resolution = "uploaded";
