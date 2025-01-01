import { SectionActions } from "@/src/containers/export";
import { MainLayout } from "@/src/layouts/export";

export const MenuPage = (): JSX.Element => {
  return (
    <MainLayout className="flex items-center justify-center">
      <SectionActions></SectionActions>
    </MainLayout>
  );
};
