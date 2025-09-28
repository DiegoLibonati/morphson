import { Navigate, Route, Routes } from "react-router-dom";

import { EditorProvider, JSONProvider } from "@src/contexts/export";
import {
  LoadJsonPage,
  MenuPage,
  TransformJsonPage,
  ResolutionPage,
} from "@src/pages/export";

export const PublicRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path={"/"} element={<MenuPage></MenuPage>}></Route>
      <Route
        path={"/json/load"}
        element={
          <JSONProvider>
            <EditorProvider>
              <LoadJsonPage></LoadJsonPage>
            </EditorProvider>
          </JSONProvider>
        }
      ></Route>
      <Route
        path="/json/transform"
        element={
          <JSONProvider>
            <EditorProvider>
              <TransformJsonPage></TransformJsonPage>
            </EditorProvider>
          </JSONProvider>
        }
      ></Route>
      <Route
        path="/json/resolution/:resolution"
        element={<ResolutionPage></ResolutionPage>}
      ></Route>
      <Route path={"/*"} element={<Navigate to="/" />}></Route>
    </Routes>
  );
};
