import { ChangeEvent, useState } from "react";

interface UseFormProps<T> {
  initialValueForm: T;
}

type UseForm<T> = {
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

export const useForm = <T extends object>({
  initialValueForm,
}: UseFormProps<T>): UseForm<T> => {
  const [formState, setFormState] = useState<T>(initialValueForm);

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    const inputName = target.name;
    const inputValue = target.value;

    return setFormState({ ...formState, [inputName]: inputValue });
  };

  const onInputFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    const inputName = target.name;
    const inputFile = target.files!;

    if (inputFile.length === 0)
      throw "The requested file was not uploaded successfully.";

    return setFormState({ ...formState, [inputName]: inputFile[0] });
  };

  const onCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    const inputName = target.name;
    const inputChecked = target.checked;

    return setFormState({ ...formState, [inputName]: inputChecked });
  };

  const onSelectChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const target = e.target as HTMLSelectElement;
    const inputName = target.name;
    const inputValue = target.value;

    return setFormState({ ...formState, [inputName]: inputValue });
  };

  const onMultiSelectChange = (
    e: ChangeEvent<HTMLSelectElement>,
    key: keyof T
  ) => {
    const target = e.target as HTMLSelectElement;
    const multiSelectValue = target.value;
    const currentMultiSelectValue = formState[key] as string;

    if (multiSelectValue === "all" || currentMultiSelectValue === "all")
      return setFormState({ ...formState, [key]: multiSelectValue });

    if (currentMultiSelectValue.includes(multiSelectValue)) {
      const arr = currentMultiSelectValue.split(",");

      arr.splice(arr.indexOf(multiSelectValue), 1);

      return setFormState({
        ...formState,
        [key]: arr.length === 1 ? arr[0].trim() : arr.join(",").trim(),
      });
    }

    if (currentMultiSelectValue)
      return setFormState({
        ...formState,
        [key]: `${currentMultiSelectValue},${multiSelectValue}`,
      });

    return setFormState({
      ...formState,
      [key]: multiSelectValue,
    });
  };

  const onResetForm = (): void => {
    return setFormState({ ...initialValueForm });
  };

  const onResetSpecificKeys = (keys: Array<keyof T>): void => {
    const updatedFormState = { ...formState };
    keys.forEach((key) => {
      updatedFormState[key] = initialValueForm[key];
    });

    return setFormState(updatedFormState);
  };

  return {
    formState: formState,
    onInputChange: onInputChange,
    onCheckboxChange: onCheckboxChange,
    onInputFileChange: onInputFileChange,
    onSelectChange: onSelectChange,
    onMultiSelectChange: onMultiSelectChange,
    onResetForm: onResetForm,
    onResetSpecificKeys: onResetSpecificKeys,
  };
};
