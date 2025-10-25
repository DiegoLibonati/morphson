import { Params } from "react-router-dom";

import { Resolution } from "@src/entities/app";
import {
  EditorContext,
  JSONContext,
  ModalContext,
} from "@src/entities/contexts";

export type UseForm<T> = {
  formState: T;
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  onInputFileChange: React.ChangeEventHandler<HTMLInputElement>;
  onCheckboxChange: React.ChangeEventHandler<HTMLInputElement>;
  onSelectChange: React.ChangeEventHandler<HTMLSelectElement>;
  onMultiSelectChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    key: keyof T
  ) => void;
  onResetForm: () => void;
  onResetSpecificKeys: (keys: (keyof T)[]) => void;
};

export type UseRouter = {
  params: Readonly<Params<string>>;
  searchParams: URLSearchParams;
  handleNavigateToHome: () => void;
  handleNavigateToResolution: (
    idResolution: Resolution,
    params: string
  ) => void;
};

export type UseEditorContext = EditorContext;
export type UseJSONContext = JSONContext;
export type UseModalContext = ModalContext;
