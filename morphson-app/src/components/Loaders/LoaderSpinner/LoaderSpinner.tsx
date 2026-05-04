import type { JSX } from "react";
import type { LoaderSpinnerProps } from "@/types/props";

import LoaderRoot from "@/components/Loaders/LoaderRoot/LoaderRoot";

import "@/components/Loaders/LoaderSpinner/LoaderSpinner.css";

const LoaderSpinner = ({ className }: LoaderSpinnerProps): JSX.Element => {
  return (
    <LoaderRoot className={className!}>
      <div className={`loader`}></div>
    </LoaderRoot>
  );
};

export default LoaderSpinner;
