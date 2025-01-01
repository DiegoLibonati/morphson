import { CSSProperties } from "react";

// **** GENERAL ****

export type InputJson = {
  id: string;
  name: string;
  file: File | null;
  content: string;
  keys: string[];
};

export type OutputJson = {
  id: string;
  name: string;
  model: string;
};

export type Modal = {
  message: string;
  open: boolean;
};

export type Resolution = "uploaded";

// **** INTERFACES ****

export interface GeneralProps {
  className?: string;
  children?: React.ReactNode;
  style?: CSSProperties;
}
