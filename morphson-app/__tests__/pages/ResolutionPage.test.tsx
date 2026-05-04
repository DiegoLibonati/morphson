import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import ResolutionPage from "@/pages/ResolutionPage/ResolutionPage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual<Record<string, unknown>>("react-router-dom"),
  useNavigate: (): jest.Mock => mockNavigate,
}));

const renderPage = (resolution: string, queryParams = ""): RenderResult =>
  render(
    <MemoryRouter initialEntries={[`/json/resolution/${resolution}?${queryParams}`]}>
      <Routes>
        <Route path="/json/resolution/:resolution" element={<ResolutionPage />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("ResolutionPage", () => {
  describe("rendering", () => {
    it("should render SectionJsonUploaded when resolution is uploaded", () => {
      renderPage("uploaded", "name=my-file.json");
      expect(screen.getByText(/successfully uploaded/i)).toBeInTheDocument();
    });

    it("should display the json name from search params", () => {
      renderPage("uploaded", "name=data.json");
      expect(screen.getByText("data.json")).toBeInTheDocument();
    });

    it("should display unkwonk when name param is missing", () => {
      renderPage("uploaded");
      expect(screen.getByText("unkwonk")).toBeInTheDocument();
    });

    it("should render the Home link in the uploaded section", () => {
      renderPage("uploaded", "name=file.json");
      expect(screen.getByRole("link", { name: "Go to Home" })).toBeInTheDocument();
    });
  });

  describe("invalid resolution", () => {
    it("should navigate to home when resolution is invalid", () => {
      renderPage("invalid-resolution");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
