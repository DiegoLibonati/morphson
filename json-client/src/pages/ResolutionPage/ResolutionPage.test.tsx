import { screen, render } from "@testing-library/react";

import { MemoryRouter, Route, Routes } from "react-router-dom";

import { ResolutionPage } from "./ResolutionPage";

import { mockResolutionUploaded } from "@/tests/jest.constants";

type RenderComponent = {
  container: HTMLElement;
};

const name = "asd";

const renderComponent = (): RenderComponent => {
  const { container } = render(
    <MemoryRouter
      initialEntries={[
        `/json/resolution/${mockResolutionUploaded}?name=${name}`,
      ]}
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <Routes>
        <Route
          path="/json/resolution/:resolution"
          element={<ResolutionPage></ResolutionPage>}
        ></Route>
      </Routes>
    </MemoryRouter>
  );

  return {
    container: container,
  };
};

describe("ResolutionPage.tsx", () => {
  describe("General Tests.", () => {
    test("It must render the main.", () => {
      renderComponent();

      const main = screen.getByRole("main");

      expect(main).toBeInTheDocument();
    });

    test("It must render the json upload message and the link to home.", () => {
      renderComponent();

      const message = screen.getByText(new RegExp(name));
      const linkHome = screen.getByRole("link", { name: /go to home/i });

      expect(message).toBeInTheDocument();
      expect(linkHome).toBeInTheDocument();
    });
  });
});
