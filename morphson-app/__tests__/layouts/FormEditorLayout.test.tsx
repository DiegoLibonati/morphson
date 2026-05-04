import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import type { JSX } from "react";
import type { RenderResult } from "@testing-library/react";
import type { OnChange, OnMount } from "@monaco-editor/react";

import FormEditorLayout from "@/layouts/FormEditorLayout/FormEditorLayout";

import { JSONProvider } from "@/contexts/JSONContext/JSONProvider";
import { EditorProvider } from "@/contexts/EditorContext/EditorProvider";

jest.mock("@monaco-editor/react", () => ({
  Editor: ({
    value,
    onChange,
    onMount,
  }: {
    value: string;
    onChange?: OnChange;
    onMount?: OnMount;
  }): JSX.Element => {
    const mockMonaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose: jest.fn() })),
        CompletionItemKind: { Function: 1 },
        CompletionItemInsertTextRule: { InsertAsSnippet: 4 },
      },
    } as never;
    if (onMount) onMount({} as never, mockMonaco);
    return (
      <textarea
        data-testid="monaco-editor"
        value={value}
        onChange={(e) => onChange?.(e.target.value, undefined as never)}
      />
    );
  },
}));

const mockOnSubmit = jest.fn((e: React.SyntheticEvent) => {
  e.preventDefault();
});
const MockLoader = (): React.JSX.Element => <div data-testid="loader">Loading</div>;

const renderComponent = (
  jsonTypeToEdit: "input" | "outputWithInput" = "input",
  loading = false
): RenderResult =>
  render(
    <MemoryRouter>
      <JSONProvider>
        <EditorProvider>
          <FormEditorLayout
            onSubmit={mockOnSubmit}
            loading={loading}
            LoadingComponent={MockLoader}
            jsonTypeToEdit={jsonTypeToEdit}
          >
            <p>Form content</p>
          </FormEditorLayout>
        </EditorProvider>
      </JSONProvider>
    </MemoryRouter>
  );

describe("FormEditorLayout", () => {
  describe("rendering", () => {
    it("should render children inside the form", () => {
      renderComponent();
      expect(screen.getByText("Form content")).toBeInTheDocument();
    });

    it("should render the Home back link", () => {
      renderComponent();
      expect(screen.getByRole("link", { name: "Go to Home" })).toBeInTheDocument();
    });

    it("should render the Home link pointing to /", () => {
      renderComponent();
      expect(screen.getByRole("link", { name: "Go to Home" })).toHaveAttribute("href", "/");
    });

    it("should render InputEditor when jsonTypeToEdit is input", () => {
      renderComponent("input");
      expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
    });

    it("should render OutputWithInputEditor when jsonTypeToEdit is outputWithInput", () => {
      renderComponent("outputWithInput");
      expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("should not render the loading component when loading is false", () => {
      renderComponent("input", false);
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    it("should render the loading component when loading is true", () => {
      renderComponent("input", true);
      expect(screen.getByTestId("loader")).toBeInTheDocument();
    });
  });
});
