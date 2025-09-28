import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { Resolution } from "@src/entities/entities";
import { UseRouter } from "@src/entities/hooks";

export const useRouter = (): UseRouter => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleNavigateToHome = () => {
    return navigate("/");
  };

  const handleNavigateToResolution = (
    idResolution: Resolution,
    params: string
  ): void => {
    return navigate(`/json/resolution/${idResolution}?${params}`);
  };

  return {
    params: params,
    searchParams: searchParams,
    handleNavigateToHome: handleNavigateToHome,
    handleNavigateToResolution: handleNavigateToResolution,
  };
};
