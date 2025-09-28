import { ButtonSubmitProps } from "@src/entities/props";

export const ButtonSubmit = ({
  ariaLabel,
  disabled,
  children,
  className,
}: ButtonSubmitProps): JSX.Element => {
  return (
    <button
      className={`w-full h-10 text-white bg-secondary rounded-lg transition-all hover:bg-tertiary hover:font-semibold disabled:bg-lightGrey disabled:cursor-not-allowed disabled:text-black disabled:font-normal ${className}`}
      type="submit"
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
