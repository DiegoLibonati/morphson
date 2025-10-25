import { SelectNormalProps } from "@src/entities/props";

import { SelectWithLabel } from "@src/components/Selects/SelectWithLabel/SelectWithLabel";

export const SelectNormal = ({
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
        className={`bg-secondary border border-lightGrey cursor-pointer text-white text-sm rounded-lg focus:border-white block w-full p-2.5 ${className}`}
        name={name}
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
    </SelectWithLabel>
  );
};
