import { FaCheckCircle } from "react-icons/fa";

import type { JSX } from "react";
import type { SectionJsonUploadedProps } from "@/types/props";

import AnchorAction from "@/components/Anchors/AnchorAction/AnchorAction";

const SectionJsonUploaded = ({ jsonName }: SectionJsonUploadedProps): JSX.Element => {
  return (
    <section className="flex flex-col items-center justify-center w-full h-full gap-2">
      <FaCheckCircle fontSize={48} className="fill-white"></FaCheckCircle>
      <p className="text-white text-lg">
        JSON: <span className="font-semibold">{jsonName}</span> successfully uploaded!
      </p>
      <AnchorAction noMark={true} ariaLabel="Go to Home" to="/">
        Home
      </AnchorAction>
    </section>
  );
};

export default SectionJsonUploaded;
