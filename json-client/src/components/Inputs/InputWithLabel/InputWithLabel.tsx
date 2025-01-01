import { GeneralProps } from "@/src/entities/entities.d";

interface InputWithLabelProps extends GeneralProps {
  id: string;
  label: string;
}

export const InputWithLabel = ({
  id,
  label,
  className,
  children,
}: InputWithLabelProps): JSX.Element => {
  return (
    <div className={`w-full h-auto ${className}`}>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-white">
        {label}
      </label>
      {children}
    </div>
  );
};
