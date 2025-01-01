import { GeneralProps } from "@/src/entities/entities.d";

import { InputWithLabel } from "@/src/components/Inputs/export";

interface InputFileProps extends GeneralProps {
  id: string;
  label: string;
  buttonLabel: string;
  emptyLabel: string;
  name: string;
  value: string;
  accept?: string;
  spanClassName?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const InputFile = ({
  id,
  label,
  name,
  value,
  buttonLabel,
  emptyLabel,
  className,
  accept,
  spanClassName,
  onChange,
}: InputFileProps): JSX.Element => {
  return (
    <InputWithLabel id={id} label={label}>
      <div className={`relative w-full h-10 ${className}`}>
        <input
          id={id}
          name={name}
          className="absolute left-0 top-0 w-full cursor-pointer h-full opacity-0"
          type="file"
          accept={accept}
          onChange={onChange}
        />
        <div className="flex flex-row w-full h-full cursor-pointer">
          <button
            type="button"
            aria-label={buttonLabel}
            className="w-[30%] h-full text-sm bg-white text-black rounded-tl-lg rounded-bl-lg font-semibold"
          >
            {buttonLabel}
          </button>
          <span
            className={`flex items-center w-[70%] h-full bg-secondary px-2 text-white text-sm rounded-tr-lg rounded-br-lg ${spanClassName}`}
          >
            {value ? value : emptyLabel}
          </span>
        </div>
      </div>
    </InputWithLabel>
  );
};
