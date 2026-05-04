import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import SectionActions from "@/components/Sections/SectionActions/SectionActions";

const renderComponent = (): RenderResult =>
  render(
    <MemoryRouter>
      <SectionActions />
    </MemoryRouter>
  );

describe("SectionActions", () => {
  describe("rendering", () => {
    it("should render the Load JSON link", () => {
      renderComponent();
      expect(screen.getByRole("link", { name: "Go to Load JSON" })).toBeInTheDocument();
      expect(screen.getByText("Load JSON")).toBeInTheDocument();
    });

    it("should render the Transform JSON link", () => {
      renderComponent();
      expect(screen.getByRole("link", { name: "Go to Transform JSON" })).toBeInTheDocument();
      expect(screen.getByText("Transform JSON")).toBeInTheDocument();
    });

    it("should link Load JSON to /json/load", () => {
      renderComponent();
      expect(screen.getByRole("link", { name: "Go to Load JSON" })).toHaveAttribute(
        "href",
        "/json/load"
      );
    });

    it("should link Transform JSON to /json/transform", () => {
      renderComponent();
      expect(screen.getByRole("link", { name: "Go to Transform JSON" })).toHaveAttribute(
        "href",
        "/json/transform"
      );
    });
  });
});
