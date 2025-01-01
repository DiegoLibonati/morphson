import { GeneralProps } from "@/src/entities/entities.d";

interface MainLayoutProps extends GeneralProps {}

export const MainLayout = ({
  className,
  children,
}: MainLayoutProps): JSX.Element => {
  return (
    <main className={`w-full min-h-screen p-4 ${className}`}>{children}</main>
  );
};
