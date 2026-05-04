import type { JSX } from "react";
import type { SelectOptionProps } from "@/types/props";

const SelectOption = ({ value, children }: SelectOptionProps): JSX.Element => {
  return <option value={value}>{children}</option>;
};

export default SelectOption;
