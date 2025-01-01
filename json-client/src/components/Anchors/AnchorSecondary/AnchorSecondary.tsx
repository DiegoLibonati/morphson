import { Link } from "react-router-dom";

import { GeneralProps } from "@/src/entities/entities";

interface AnchorSecondaryProps extends GeneralProps {
  ariaLabel: string;
  to: string;
}

export const AnchorSecondary = ({
  ariaLabel,
  to,
  children,
  className,
}: AnchorSecondaryProps): JSX.Element => {
  return (
    <Link
      className={`text-sm text-white bg-secondary rounded-lg p-2 transition-all hover:bg-opacity-75 active:scale-90 ${className}`}
      aria-label={ariaLabel}
      to={to}
    >
      {children}
    </Link>
  );
};
