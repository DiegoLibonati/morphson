import { GeneralProps } from "@/src/entities/entities";

interface SelectOptionProps extends GeneralProps {
  value: string;
  selected?: boolean;
}

export const SelectOption = ({
  value,
  selected,
  children,
}: SelectOptionProps): JSX.Element => {
  return (
    <option value={value} selected={selected}>
      {children}
    </option>
  );
};
