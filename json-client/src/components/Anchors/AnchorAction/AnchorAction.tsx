import { Link } from "react-router-dom";

import { AnchorActionProps } from "@src/entities/props";

export const AnchorAction = ({
  to,
  ariaLabel,
  noMark,
  className,
  children,
}: AnchorActionProps): JSX.Element => {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className={`group relative w-64 p-2 bg-secondary text-lightGrey text-center text-xl rounded-lg transition-all hover:text-white hover:font-semibold ${className}`}
    >
      {children}
      {!noMark && (
        <span className="absolute z-10 right-0 top-0 w-4 h-full bg-tertiary rounded-tr-lg rounded-br-lg opacity-0 transition-all group-hover:opacity-100 span-nomark"></span>
      )}
    </Link>
  );
};
