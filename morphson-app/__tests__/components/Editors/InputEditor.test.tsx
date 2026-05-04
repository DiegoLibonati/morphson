import { render, screen, waitFor, fireEvent } from "@testing-library/react";

import type { JSX } from "react";
import type { RenderResult } from "@testing-library/react";
import type { OnChange } from "@monaco-editor/react";

import InputEditor from "@/components/Editors/InputEditor/InputEditor";

import { EditorProvider } from "@/contexts/EditorContext/EditorProvider";
import { JSONProvider } from "@/contexts/JSONContext/JSONProvider";

jest.mock("@monaco-editor/react", () => ({
  Editor: ({ value, onChange }: { value: string; onChange?: OnChange }): JSX.Element => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange?.(e.target.value, undefined as never)}
    />
  ),
}));

const renderComponent = (): RenderResult =>
  render(
    <JSONProvider>
      <EditorProvider>
        <InputEditor />
      </EditorProvider>
    </JSONProvider>
  );

describe("InputEditor", () => {
  describe("rendering", () => {
    it("should render the monaco editor", () => {
      renderComponent();
      expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
    });

    it("should start with the default value {}", () => {
      renderComponent();
      expect(screen.getByTestId("monaco-editor")).toHaveValue("{}");
    });
  });

  describe("behavior", () => {
    it("should update the editor text when content changes", async () => {
      renderComponent();
      const editor = screen.getByTestId("monaco-editor");
      fireEvent.change(editor, { target: { value: '{"name":"test"}' } });
      await waitFor(() => {
        expect(screen.getByTestId("monaco-editor")).toHaveValue('{"name":"test"}');
      });
    });
  });
});
