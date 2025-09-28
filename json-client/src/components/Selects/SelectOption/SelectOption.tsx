import { SelectOptionProps } from "@src/entities/props";

export const SelectOption = ({
  value,
  children,
}: SelectOptionProps): JSX.Element => {
  return <option value={value}>{children}</option>;
};
