import { FaArrowLeft } from "react-icons/fa";

import { FormEditorLayoutProps } from "@src/entities/props";

import { FormMenu } from "@src/components/Forms/export";
import {
  InputEditor,
  OutputWithInputEditor,
} from "@src/components/Editors/export";
import { AnchorSecondary } from "@src/components/Anchors/export";

import { MainLayout } from "@src/layouts/export";

export const FormEditorLayout = ({
  loading,
  LoadingComponent,
  jsonTypeToEdit,
  children,
  onSubmit,
}: FormEditorLayoutProps): JSX.Element => {
  return (
    <MainLayout
      className={`flex flex-col items-start justify-start gap-2 lg:flex-row lg:h-screen`}
    >
      {loading && <LoadingComponent></LoadingComponent>}

      <FormMenu onSubmit={onSubmit}>{children}</FormMenu>
      <section className="w-full h-screen mt-2 lg:mt-0 lg:w-[65%] lg:h-full">
        {jsonTypeToEdit === "input" && <InputEditor></InputEditor>}
        {jsonTypeToEdit === "outputWithInput" && (
          <OutputWithInputEditor></OutputWithInputEditor>
        )}
      </section>

      <AnchorSecondary
        className="absolute right-2 top-2 z-[40]"
        ariaLabel="Go to Home"
        to="/"
      >
        <FaArrowLeft fontSize={24} className="fill-white"></FaArrowLeft>
      </AnchorSecondary>
    </MainLayout>
  );
};
