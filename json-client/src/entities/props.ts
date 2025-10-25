import { CSSProperties } from "react";
import { editor } from "monaco-editor";
import { OnChange, OnMount } from "@monaco-editor/react";

export interface DefaultProps {
  className?: string;
  children?: React.ReactNode;
  style?: CSSProperties;
}

export interface AnchorActionProps extends DefaultProps {
  to: string;
  ariaLabel: string;
  noMark?: boolean;
}

export interface AnchorSecondaryProps extends DefaultProps {
  ariaLabel: string;
  to: string;
}

export interface ButtonSecondaryProps extends DefaultProps {
  ariaLabel: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface ButtonSubmitProps extends DefaultProps {
  ariaLabel: string;
  disabled?: boolean;
}

export interface MonacoEditorProps extends DefaultProps {
  language: string;
  defaultValue: string;
  value: string;
  theme: string;
  height?: string;
  options?: editor.IStandaloneEditorConstructionOptions;
  onChange: OnChange;
  onMount?: OnMount;
}

export interface FormMenuProps extends DefaultProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export interface InputCheckProps extends DefaultProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export interface InputFieldProps extends DefaultProps {
  id: string;
  label: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export interface InputFileProps extends DefaultProps {
  id: string;
  label: string;
  buttonLabel: string;
  emptyLabel: string;
  name: string;
  value: string;
  accept?: string;
  spanClassName?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export interface InputWithLabelProps extends DefaultProps {
  id: string;
  label: string;
}

export interface LoaderRootProps extends DefaultProps {}

export interface LoaderSpinnerProps extends DefaultProps {}

export interface ModalProps extends DefaultProps {}

export interface SelectNormalProps extends DefaultProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

export interface SelectOptionProps extends DefaultProps {
  value: string;
  selected?: boolean;
}

export interface SelectWithLabelProps extends DefaultProps {
  id: string;
  label: string;
}

export interface UseFormProps<T> {
  initialValueForm: T;
}

export interface FormEditorLayoutProps extends DefaultProps {
  loading: boolean;
  jsonTypeToEdit: "input" | "outputWithInput";
  LoadingComponent: React.ComponentType;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export interface MainLayoutProps extends DefaultProps {}

export interface EditorProviderProps extends DefaultProps {}

export interface JSONProviderProps extends DefaultProps {}

export interface ModalProviderProps extends DefaultProps {}

export interface SectionJsonUploadedProps {
  jsonName: string;
}
