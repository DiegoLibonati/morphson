import { useEffect, useState } from "react";

import type { JSX } from "react";

import SectionJsonUploaded from "@/components/Sections/SectionJsonUploaded/SectionJsonUploaded";

import MainLayout from "@/layouts/MainLayout/MainLayout";

import { useRouter } from "@/hooks/useRouter";

const ResolutionPage = (): JSX.Element => {
  const [availablesIds] = useState<string[]>(["uploaded"]);

  const { params, searchParams, handleNavigateToHome } = useRouter();

  const { resolution } = params;

  const jsonName = searchParams.get("name") ?? "unkwonk";
  const res = resolution ? resolution.toLocaleLowerCase().trim() : "";

  useEffect(() => {
    if (!res || !availablesIds.includes(res)) {
      handleNavigateToHome();
      return;
    }
  }, [res]);

  return (
    <MainLayout className="flex items-center justify-center">
      {res === "uploaded" && <SectionJsonUploaded jsonName={jsonName}></SectionJsonUploaded>}
    </MainLayout>
  );
};

export default ResolutionPage;
