import type { JSX } from "react";
import type { FormMenuProps } from "@/types/props";

const FormMenu = ({ className, children, onSubmit }: FormMenuProps): JSX.Element => {
  return (
    <form
      className={`flex flex-col w-full h-auto gap-2 mb-2 lg:w-[35%] lg:h-full lg:mb-0 lg:bg-secondary lg:rounded-lg lg:p-2 ${className}`}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
};

export default FormMenu;
