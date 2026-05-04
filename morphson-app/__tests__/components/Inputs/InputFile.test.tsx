import { render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";

import InputFile from "@/components/Inputs/InputFile/InputFile";

const mockOnChange = jest.fn();

const renderComponent = (value = ""): RenderResult =>
  render(
    <InputFile
      id="file-input"
      label="Upload JSON"
      name="jsonFile"
      value={value}
      buttonLabel="Select a JSON"
      emptyLabel="No JSON selected"
      accept=".json"
      onChange={mockOnChange}
    />
  );

describe("InputFile", () => {
  describe("rendering", () => {
    it("should render the label", () => {
      renderComponent();
      expect(screen.getByText("Upload JSON")).toBeInTheDocument();
    });

    it("should render the button with buttonLabel", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "Select a JSON" })).toBeInTheDocument();
    });

    it("should show emptyLabel when no file is selected", () => {
      renderComponent("");
      expect(screen.getByText("No JSON selected")).toBeInTheDocument();
    });

    it("should show the filename when a file is selected", () => {
      renderComponent("my-file.json");
      expect(screen.getByText("my-file.json")).toBeInTheDocument();
    });

    it("should set accept attribute on file input", () => {
      const { container } = renderComponent();
      const fileInput = container.querySelector<HTMLInputElement>("input[type='file']");
      expect(fileInput).toHaveAttribute("accept", ".json");
    });
  });
});
