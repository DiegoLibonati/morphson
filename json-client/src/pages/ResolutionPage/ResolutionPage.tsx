import { useEffect, useState } from "react";

import { SectionJsonUploaded } from "@src/components/Sections/SectionJsonUploaded/SectionJsonUploaded";

import { MainLayout } from "@src/layouts/MainLayout/MainLayout";

import { useRouter } from "@src/hooks/useRouter";

export const ResolutionPage = (): JSX.Element => {
  const [availablesIds] = useState<string[]>(["uploaded"]);

  const { params, searchParams, handleNavigateToHome } = useRouter();

  const { resolution } = params;

  const jsonName = searchParams.get("name") || "unkwonk";
  const res = resolution ? resolution!.toLocaleLowerCase().trim() : "";

  useEffect(() => {
    if (!res || !availablesIds.includes(res)) return handleNavigateToHome();
  }, [res]);

  return (
    <MainLayout className="flex items-center justify-center">
      {res === "uploaded" && (
        <SectionJsonUploaded jsonName={jsonName}></SectionJsonUploaded>
      )}
    </MainLayout>
  );
};
