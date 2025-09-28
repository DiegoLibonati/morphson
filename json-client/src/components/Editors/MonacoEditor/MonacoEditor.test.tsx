import { render } from "@testing-library/react";

import { MonacoEditor } from "@src/components/Editors/MonacoEditor/MonacoEditor";
import { MonacoEditorProps } from "@src/entities/props";

type RenderComponent = {
  props: {
    onChange: jest.Mock;
    onMount: jest.Mock;
  } & MonacoEditorProps;
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
    onChange: jest.fn(),
    onMount: jest.fn(),
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
      onChange={props.onChange}
      onMount={props.onMount}
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
