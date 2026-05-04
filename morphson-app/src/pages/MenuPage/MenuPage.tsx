import type { JSX } from "react";

import SectionActions from "@/components/Sections/SectionActions/SectionActions";

import MainLayout from "@/layouts/MainLayout/MainLayout";

const MenuPage = (): JSX.Element => {
  return (
    <MainLayout className="flex items-center justify-center">
      <SectionActions></SectionActions>
    </MainLayout>
  );
};

export default MenuPage;
