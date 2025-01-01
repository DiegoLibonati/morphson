import { GeneralProps } from "@/src/entities/entities";

import { LoaderRoot } from "@/src/components/Loaders/export";

import "@/src/components/Loaders/LoaderSpinner/LoaderSpinner.css";

interface LoaderSpinnerProps extends GeneralProps {}

export const LoaderSpinner = ({
  className,
}: LoaderSpinnerProps): JSX.Element => {
  return (
    <LoaderRoot className={className}>
      <div className={`loader`}></div>
    </LoaderRoot>
  );
};
