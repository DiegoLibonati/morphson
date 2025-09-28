import { ButtonSecondaryProps } from "@src/entities/props";

export const ButtonSecondary = ({
  ariaLabel,
  children,
  className,
  onClick,
}: ButtonSecondaryProps): JSX.Element => {
  return (
    <button
      className={`text-sm text-white bg-secondary rounded-lg p-2 transition-all hover:bg-opacity-75 active:scale-90 ${className}`}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
