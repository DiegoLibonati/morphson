import { Routes, Route, Navigate } from "react-router-dom";

import { MenuPage } from "@src/pages/MenuPage/MenuPage";
import { LoadJsonPage } from "@src/pages/LoadJsonPage/LoadJsonPage";
import { TransformJsonPage } from "@src/pages/TransformJsonPage/TransformJsonPage";
import { ResolutionPage } from "@src/pages/ResolutionPage/ResolutionPage";

import { JSONProvider } from "@src/contexts/JSONContext/JSONContext";
import { EditorProvider } from "@src/contexts/EditorContext/EditorContext";

import { JSONRoute } from "@src/router/JSONRoute";

export const AppRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route element={<JSONRoute />}>
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
      </Route>

      <Route path="/*" element={<Navigate to="/"></Navigate>}></Route>
    </Routes>
  );
};
