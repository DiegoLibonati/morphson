import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import SectionJsonUploaded from "@/components/Sections/SectionJsonUploaded/SectionJsonUploaded";

const renderComponent = (jsonName = "my-file.json"): RenderResult =>
  render(
    <MemoryRouter>
      <SectionJsonUploaded jsonName={jsonName} />
    </MemoryRouter>
  );

describe("SectionJsonUploaded", () => {
  describe("rendering", () => {
    it("should render the json name", () => {
      renderComponent("data.json");
      expect(screen.getByText("data.json")).toBeInTheDocument();
    });

    it("should render the success message", () => {
      renderComponent("data.json");
      expect(screen.getByText(/successfully uploaded/i)).toBeInTheDocument();
    });

    it("should render the Home link", () => {
      renderComponent();
      expect(screen.getByRole("link", { name: "Go to Home" })).toBeInTheDocument();
    });

    it("should link Home to /", () => {
      renderComponent();
      expect(screen.getByRole("link", { name: "Go to Home" })).toHaveAttribute("href", "/");
    });
  });
});
