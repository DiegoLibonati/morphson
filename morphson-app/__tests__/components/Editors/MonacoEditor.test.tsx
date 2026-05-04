import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { JSX } from "react";
import type { RenderResult } from "@testing-library/react";
import type { OnChange } from "@monaco-editor/react";

import MonacoEditor from "@/components/Editors/MonacoEditor/MonacoEditor";

const mockOnChange = jest.fn();

jest.mock("@monaco-editor/react", () => ({
  Editor: ({ value, onChange }: { value: string; onChange?: OnChange }): JSX.Element => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange?.(e.target.value, undefined as never)}
    />
  ),
}));

const renderComponent = (value = "{}"): RenderResult =>
  render(
    <MonacoEditor
      language="json"
      defaultValue="{}"
      value={value}
      theme="vs-dark"
      onChange={mockOnChange}
    />
  );

describe("MonacoEditor", () => {
  describe("rendering", () => {
    it("should render the editor", () => {
      renderComponent();
      expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
    });

    it("should display the provided value", () => {
      renderComponent('{"key": "value"}');
      expect(screen.getByTestId("monaco-editor")).toHaveValue('{"key": "value"}');
    });

    it("should render inside a wrapper div", () => {
      const { container } = renderComponent();
      expect(container.firstChild).toHaveClass("rounded-lg");
    });

    it("should apply custom className to wrapper", () => {
      render(
        <MonacoEditor
          language="json"
          defaultValue="{}"
          value="{}"
          theme="vs-dark"
          onChange={mockOnChange}
          className="custom-editor"
        />
      );
      const { container } = render(
        <MonacoEditor
          language="json"
          defaultValue="{}"
          value="{}"
          theme="vs-dark"
          onChange={mockOnChange}
          className="custom-editor"
        />
      );
      expect(container.firstChild).toHaveClass("custom-editor");
    });
  });

  describe("behavior", () => {
    it("should call onChange when editor content changes", async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.clear(screen.getByTestId("monaco-editor"));
      await user.type(screen.getByTestId("monaco-editor"), "x");
      expect(mockOnChange).toHaveBeenCalled();
    });
  });
});
