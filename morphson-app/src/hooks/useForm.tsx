import { useState } from "react";

import type { ChangeEvent } from "react";
import type { UseForm } from "@/types/hooks";
import type { UseFormProps } from "@/types/props";

export const useForm = <T extends object>({ initialValueForm }: UseFormProps<T>): UseForm<T> => {
  const [formState, setFormState] = useState<T>(initialValueForm);

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const onInputFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, files } = e.target;

    if (!files || files.length === 0)
      throw new Error("The requested file was not uploaded successfully.");

    setFormState((prev) => ({ ...prev, [name]: files[0] }));
  };

  const onCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, checked } = e.target;
    setFormState((prev) => ({ ...prev, [name]: checked }));
  };

  const onSelectChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const onMultiSelectChange = (e: ChangeEvent<HTMLSelectElement>, key: keyof T): void => {
    const multiSelectValue = e.target.value;

    setFormState((prev) => {
      const currentMultiSelectValue = prev[key] as string;

      if (multiSelectValue === "all" || currentMultiSelectValue === "all") {
        return { ...prev, [key]: multiSelectValue };
      }

      if (currentMultiSelectValue.includes(multiSelectValue)) {
        const arr = currentMultiSelectValue.split(",");
        arr.splice(arr.indexOf(multiSelectValue), 1);
        return { ...prev, [key]: arr.length === 1 ? arr[0]!.trim() : arr.join(",").trim() };
      }

      if (currentMultiSelectValue) {
        return { ...prev, [key]: `${currentMultiSelectValue},${multiSelectValue}` };
      }

      return { ...prev, [key]: multiSelectValue };
    });
  };

  const onResetForm = (): void => {
    setFormState({ ...initialValueForm });
  };

  const onResetSpecificKeys = (keys: (keyof T)[]): void => {
    setFormState((prev) => {
      const updated = { ...prev };
      keys.forEach((key) => {
        updated[key] = initialValueForm[key];
      });
      return updated;
    });
  };

  return {
    formState,
    onInputChange,
    onCheckboxChange,
    onInputFileChange,
    onSelectChange,
    onMultiSelectChange,
    onResetForm,
    onResetSpecificKeys,
  };
};
