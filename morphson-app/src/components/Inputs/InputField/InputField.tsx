import type { JSX } from "react";
import type { InputFieldProps } from "@/types/props";

import InputWithLabel from "@/components/Inputs/InputWithLabel/InputWithLabel";

const InputField = ({
  id,
  name,
  value,
  label,
  placeholder,
  className,
  onChange,
}: InputFieldProps): JSX.Element => {
  return (
    <InputWithLabel id={id} label={label}>
      <input
        id={id}
        name={name}
        value={value}
        type="text"
        className={`bg-secondary text-sm text-white w-full h-10 rounded-lg p-2 transition-all placeholder:text-light-grey focus:outline-white ${className}`}
        placeholder={placeholder}
        onChange={onChange}
      />
    </InputWithLabel>
  );
};

export default InputField;
