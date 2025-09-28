export type UseForm<T> = {
  formState: T;
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  onInputFileChange: React.ChangeEventHandler<HTMLInputElement>;
  onCheckboxChange: React.ChangeEventHandler<HTMLInputElement>;
  onSelectChange: React.ChangeEventHandler<HTMLSelectElement>;
  onMultiSelectChange: (
    e: ChangeEvent<HTMLSelectElement>,
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
