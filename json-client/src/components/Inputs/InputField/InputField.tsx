import { InputFieldProps } from "@src/entities/props";

import { InputWithLabel } from "@src/components/Inputs/InputWithLabel/InputWithLabel";

export const InputField = ({
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
        className={`bg-secondary text-sm text-white w-full h-10 rounded-lg p-2 transition-all placeholder:text-lightGrey focus:outline-white ${className}`}
        placeholder={placeholder}
        onChange={onChange}
      />
    </InputWithLabel>
  );
};
