import type { JSX } from "react";
import type { SelectNormalProps } from "@/types/props";

import SelectWithLabel from "@/components/Selects/SelectWithLabel/SelectWithLabel";

const SelectNormal = ({
  id,
  label,
  name,
  value,
  className,
  children,
  onChange,
}: SelectNormalProps): JSX.Element => {
  return (
    <SelectWithLabel id={id} label={label}>
      <select
        id={id}
        className={`bg-secondary border border-light-grey cursor-pointer text-white text-sm rounded-lg focus:border-white block w-full p-2.5 ${className}`}
        name={name}
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
    </SelectWithLabel>
  );
};

export default SelectNormal;
