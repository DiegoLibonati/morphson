import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import MenuPage from "@/pages/MenuPage/MenuPage";

const renderPage = (): RenderResult =>
  render(
    <MemoryRouter>
      <MenuPage />
    </MemoryRouter>
  );

describe("MenuPage", () => {
  describe("rendering", () => {
    it("should render the main element", () => {
      renderPage();
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("should render the Load JSON link", () => {
      renderPage();
      expect(screen.getByRole("link", { name: "Go to Load JSON" })).toBeInTheDocument();
    });

    it("should render the Transform JSON link", () => {
      renderPage();
      expect(screen.getByRole("link", { name: "Go to Transform JSON" })).toBeInTheDocument();
    });

    it("should link Load JSON to /json/load", () => {
      renderPage();
      expect(screen.getByRole("link", { name: "Go to Load JSON" })).toHaveAttribute(
        "href",
        "/json/load"
      );
    });

    it("should link Transform JSON to /json/transform", () => {
      renderPage();
      expect(screen.getByRole("link", { name: "Go to Transform JSON" })).toHaveAttribute(
        "href",
        "/json/transform"
      );
    });
  });
});
