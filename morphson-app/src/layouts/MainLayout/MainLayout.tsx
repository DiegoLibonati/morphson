import type { JSX } from "react";
import type { MainLayoutProps } from "@/types/props";

const MainLayout = ({ className, children }: MainLayoutProps): JSX.Element => {
  return <main className={`w-full min-h-screen p-4 ${className}`}>{children}</main>;
};

export default MainLayout;
