export interface GeneralProps {
  className?: string;
  children?: React.ReactNode;
  style?: CSSProperties;
}

export interface AnchorActionProps extends GeneralProps {
  to: string;
  ariaLabel: string;
  noMark?: boolean;
}

export interface AnchorSecondaryProps extends GeneralProps {
  ariaLabel: string;
  to: string;
}

export interface ButtonSecondaryProps extends GeneralProps {
  ariaLabel: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface ButtonSubmitProps extends GeneralProps {
  ariaLabel: string;
  disabled?: boolean;
}

export interface MonacoEditorProps extends GeneralProps {
  language: string;
  defaultValue: string;
  value: string;
  theme: string;
  height?: string;
  options?: editor.IStandaloneEditorConstructionOptions;
  onChange: OnChange;
  onMount?: OnMount;
}

export interface FormMenuProps extends GeneralProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export interface InputCheckProps extends GeneralProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export interface InputFieldProps extends GeneralProps {
  id: string;
  label: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export interface InputFileProps extends GeneralProps {
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

export interface InputWithLabelProps extends GeneralProps {
  id: string;
  label: string;
}

export interface LoaderRootProps extends GeneralProps {}

export interface LoaderSpinnerProps extends GeneralProps {}

export interface ModalProps extends GeneralProps {}

export interface SelectNormalProps extends GeneralProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

export interface SelectOptionProps extends GeneralProps {
  value: string;
  selected?: boolean;
}

export interface SelectWithLabelProps extends GeneralProps {
  id: string;
  label: string;
}

export interface UseFormProps<T> {
  initialValueForm: T;
}

export interface FormEditorLayoutProps extends GeneralProps {
  loading: boolean;
  jsonTypeToEdit: "input" | "outputWithInput";
  LoadingComponent: React.ComponentType;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export interface MainLayoutProps extends GeneralProps {}
