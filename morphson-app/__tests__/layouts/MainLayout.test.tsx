import { render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";

import MainLayout from "@/layouts/MainLayout/MainLayout";

const renderComponent = (): RenderResult =>
  render(
    <MainLayout>
      <p>Page content</p>
    </MainLayout>
  );

describe("MainLayout", () => {
  describe("rendering", () => {
    it("should render children", () => {
      renderComponent();
      expect(screen.getByText("Page content")).toBeInTheDocument();
    });

    it("should render a main element", () => {
      renderComponent();
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <MainLayout className="flex-center">
          <p>content</p>
        </MainLayout>
      );
      expect(screen.getByRole("main")).toHaveClass("flex-center");
    });
  });
});
