import type { Params } from "react-router-dom";

import type { Resolution } from "@/types/app";
import type { EditorContext, JSONContext, ModalContext } from "@/types/contexts";

export interface UseForm<T> {
  formState: T;
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  onInputFileChange: React.ChangeEventHandler<HTMLInputElement>;
  onCheckboxChange: React.ChangeEventHandler<HTMLInputElement>;
  onSelectChange: React.ChangeEventHandler<HTMLSelectElement>;
  onMultiSelectChange: (e: React.ChangeEvent<HTMLSelectElement>, key: keyof T) => void;
  onResetForm: () => void;
  onResetSpecificKeys: (keys: (keyof T)[]) => void;
}

export interface UseRouter {
  params: Readonly<Params>;
  searchParams: URLSearchParams;
  handleNavigateToHome: () => void;
  handleNavigateToResolution: (idResolution: Resolution, params: string) => void;
}

export type UseEditorContext = EditorContext;
export type UseJSONContext = JSONContext;
export type UseModalContext = ModalContext;
