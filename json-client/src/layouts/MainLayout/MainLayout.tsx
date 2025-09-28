import { MainLayoutProps } from "@src/entities/props";

export const MainLayout = ({
  className,
  children,
}: MainLayoutProps): JSX.Element => {
  return (
    <main className={`w-full min-h-screen p-4 ${className}`}>{children}</main>
  );
};
