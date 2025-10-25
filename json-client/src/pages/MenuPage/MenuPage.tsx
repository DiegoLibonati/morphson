import { SectionActions } from "@src/components/Sections/SectionActions/SectionActions";

import { MainLayout } from "@src/layouts/MainLayout/MainLayout";

export const MenuPage = (): JSX.Element => {
  return (
    <MainLayout className="flex items-center justify-center">
      <SectionActions></SectionActions>
    </MainLayout>
  );
};
