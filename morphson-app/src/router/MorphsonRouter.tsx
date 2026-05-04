import { Routes, Route, Navigate } from "react-router-dom";

import type { JSX } from "react";

import MenuPage from "@/pages/MenuPage/MenuPage";
import LoadJsonPage from "@/pages/LoadJsonPage/LoadJsonPage";
import TransformJsonPage from "@/pages/TransformJsonPage/TransformJsonPage";
import ResolutionPage from "@/pages/ResolutionPage/ResolutionPage";

import { JSONProvider } from "@/contexts/JSONContext/JSONProvider";
import { EditorProvider } from "@/contexts/EditorContext/EditorProvider";

import { PublicRoute } from "@/router/PublicRoute";

export const MorphsonRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
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
