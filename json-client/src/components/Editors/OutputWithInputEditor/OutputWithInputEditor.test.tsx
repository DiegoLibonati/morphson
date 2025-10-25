import { render } from "@testing-library/react";

import { OutputWithInputEditor } from "@src/components/Editors/OutputWithInputEditor/OutputWithInputEditor";

import { JSONProvider } from "@src/contexts/JSONContext/JSONContext";
import { EditorProvider } from "@src/contexts/EditorContext/EditorContext";

import { useJSONContext } from "@src/hooks/useJSONContext";

import { mockInputJsonState, mockOutputJsonState } from "@tests/jest.constants";

type RenderComponent = {
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const { container } = render(
    <JSONProvider>
      <EditorProvider>
        <OutputWithInputEditor></OutputWithInputEditor>
      </EditorProvider>
    </JSONProvider>
  );

  return {
    container: container,
  };
};

jest.mock("@src/hooks/useJSONContext", () => ({
  ...jest.requireActual("@src/hooks/useJSONContext"),
  useJSONContext: jest.fn(),
}));

describe("OutputWithInputEditor.tsx", () => {
  describe("General Tests.", () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();

      (useJSONContext as jest.Mock).mockReturnValue({
        state: {
          inputJson: mockInputJsonState,
          outputJson: mockOutputJsonState,
        },
        dispatch: mockDispatch,
      });
    });

    test("It must render the output with input editor.", async () => {
      const { container } = renderComponent();

      const outputWithInputEditor = container.querySelector<HTMLDivElement>(
        ".output-with-input-editor"
      );

      expect(outputWithInputEditor).toBeInTheDocument();
    });
  });
});
