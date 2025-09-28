import { screen, render } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import { MenuPage } from "@src/pages/MenuPage/MenuPage";

type RenderComponent = {
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const { container } = render(
    <MemoryRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <MenuPage></MenuPage>
    </MemoryRouter>
  );

  return {
    container: container,
  };
};

describe("MenuPage.tsx", () => {
  describe("General Tests.", () => {
    test("It must render the main.", () => {
      renderComponent();

      const main = screen.getByRole("main");

      expect(main).toBeInTheDocument();
    });

    test("It must render the actions.", () => {
      renderComponent();

      const linkGoToJsonLoad = screen.getByRole("link", {
        name: /go to load json/i,
      });
      const linkGoToTransformJson = screen.getByRole("link", {
        name: /go to transform json/i,
      });

      expect(linkGoToJsonLoad).toBeInTheDocument();
      expect(linkGoToJsonLoad).toHaveTextContent("Load JSON");
      expect(linkGoToTransformJson).toBeInTheDocument();
      expect(linkGoToTransformJson).toHaveTextContent("Transform JSON");
    });
  });
});
