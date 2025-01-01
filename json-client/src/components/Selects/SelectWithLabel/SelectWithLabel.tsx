import { GeneralProps } from "@/src/entities/entities";

interface SelectWithLabelProps extends GeneralProps {
  id: string;
  label: string;
}

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
