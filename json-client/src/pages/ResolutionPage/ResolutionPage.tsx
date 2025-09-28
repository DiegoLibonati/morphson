import { useEffect, useState } from "react";

import { MainLayout } from "@src/layouts/export";
import { SectionJsonUploaded } from "@src/containers/export";
import { useRouter } from "@src/hooks/export";

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
