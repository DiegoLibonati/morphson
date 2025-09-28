import { SelectWithLabelProps } from "@src/entities/props";

export const SelectWithLabel = ({
  id,
  label,
  className,
  children,
}: SelectWithLabelProps): JSX.Element => {
  return (
    <div className={`w-full h-auto ${className}`}>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-white">
        {label}
      </label>
      {children}
    </div>
  );
};
