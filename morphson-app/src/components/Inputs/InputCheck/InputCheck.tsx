import type { JSX } from "react";
import type { InputCheckProps } from "@/types/props";

const InputCheck = ({ id, label, name, value, onChange }: InputCheckProps): JSX.Element => {
  return (
    <div className="flex flex-row gap-2">
      <input id={id} type="checkbox" value={value} name={name} onChange={onChange} />
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
    </div>
  );
};

export default InputCheck;
