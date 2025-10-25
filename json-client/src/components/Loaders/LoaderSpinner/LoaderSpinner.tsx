import { LoaderSpinnerProps } from "@src/entities/props";

import { LoaderRoot } from "@src/components/Loaders/LoaderRoot/LoaderRoot";

import "@src/components/Loaders/LoaderSpinner/LoaderSpinner.css";

export const LoaderSpinner = ({
  className,
}: LoaderSpinnerProps): JSX.Element => {
  return (
    <LoaderRoot className={className}>
      <div className={`loader`}></div>
    </LoaderRoot>
  );
};
