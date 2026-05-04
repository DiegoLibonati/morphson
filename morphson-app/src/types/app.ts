export interface InputJson {
  id: number | null;
  name: string;
  content: Record<string, unknown> | null;
  keys: string[];
  keysAndValues: Record<string, unknown> | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface OutputJson {
  id: number | null;
  name: string;
  transformationModel: Record<string, unknown> | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Modal {
  message: string;
  open: boolean;
}

export type Resolution = "uploaded";
