import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import type { Resolution } from "@/types/app";
import type { UseRouter } from "@/types/hooks";

export const useRouter = (): UseRouter => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleNavigateToHome = (): void => {
    void navigate("/");
    return;
  };

  const handleNavigateToResolution = (idResolution: Resolution, params: string): void => {
    void navigate(`/json/resolution/${idResolution}?${params}`);
    return;
  };

  return {
    params: params,
    searchParams: searchParams,
    handleNavigateToHome: handleNavigateToHome,
    handleNavigateToResolution: handleNavigateToResolution,
  };
};
