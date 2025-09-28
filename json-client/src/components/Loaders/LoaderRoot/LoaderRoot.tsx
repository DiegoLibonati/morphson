import { LoaderRootProps } from "@src/entities/props";

export const LoaderRoot = ({
  className,
  children,
}: LoaderRootProps): JSX.Element => {
  return (
    <div
      className={`absolute flex items-center justify-center w-full h-full top-0 left-0 z-[50] bg-black bg-opacity-50 ${className}`}
    >
      {children}
    </div>
  );
};
