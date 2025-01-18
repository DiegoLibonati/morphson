import { render } from "@testing-library/react";

import { editor } from "monaco-editor";

import { MonacoEditor } from "./MonacoEditor";

type RenderComponent = {
  props: {
    language: string;
    defaultValue: string;
    value: string;
    theme: string;
    height: string;
    options: editor.IStandaloneEditorConstructionOptions;
    className: string;
    mockOnChange: jest.Mock;
    mockOnMount: jest.Mock;
  };
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const props = {
    language: "json",
    defaultValue: "asd",
    value: "",
    theme: "vs-dark",
    height: "100vh",
    options: {},
    className: "monaco-editor",
    mockOnChange: jest.fn(),
    mockOnMount: jest.fn(),
  };

  const { container } = render(
    <MonacoEditor
      defaultValue={props.defaultValue}
      language={props.language}
      theme={props.theme}
      value={props.value}
      options={props.options}
      height={props.height}
      className={props.className}
      onChange={props.mockOnChange}
      onMount={props.mockOnMount}
    ></MonacoEditor>
  );

  return {
    props: props,
    container: container,
  };
};

describe("MonacoEditor.tsx", () => {
  describe("General Tests.", () => {
    test("It must render the monaco editor.", async () => {
      const { container } = renderComponent();

      const monacoEditor = container.querySelector(
        ".monaco-editor"
      ) as HTMLDivElement;

      expect(monacoEditor).toBeInTheDocument();
    });
  });
});
