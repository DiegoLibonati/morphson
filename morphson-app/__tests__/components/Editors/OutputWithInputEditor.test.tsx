import { render, screen, waitFor, fireEvent } from "@testing-library/react";

import type { JSX } from "react";
import type { RenderResult } from "@testing-library/react";
import type { OnChange, OnMount } from "@monaco-editor/react";

import OutputWithInputEditor from "@/components/Editors/OutputWithInputEditor/OutputWithInputEditor";

import { EditorProvider } from "@/contexts/EditorContext/EditorProvider";
import { JSONProvider } from "@/contexts/JSONContext/JSONProvider";

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
        data-testid="output-monaco-editor"
        value={value}
        onChange={(e) => onChange?.(e.target.value, undefined as never)}
      />
    );
  },
}));

const renderComponent = (): RenderResult =>
  render(
    <JSONProvider>
      <EditorProvider>
        <OutputWithInputEditor />
      </EditorProvider>
    </JSONProvider>
  );

describe("OutputWithInputEditor", () => {
  describe("rendering", () => {
    it("should render the monaco editor", () => {
      renderComponent();
      expect(screen.getByTestId("output-monaco-editor")).toBeInTheDocument();
    });

    it("should start with the default value {}", () => {
      renderComponent();
      expect(screen.getByTestId("output-monaco-editor")).toHaveValue("{}");
    });
  });

  describe("behavior", () => {
    it("should update editor text when content changes", async () => {
      renderComponent();
      const editor = screen.getByTestId("output-monaco-editor");
      fireEvent.change(editor, { target: { value: '{"result":"value"}' } });
      await waitFor(() => {
        expect(screen.getByTestId("output-monaco-editor")).toHaveValue('{"result":"value"}');
      });
    });
  });
});
