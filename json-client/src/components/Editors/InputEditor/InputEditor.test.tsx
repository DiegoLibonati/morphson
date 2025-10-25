import { render } from "@testing-library/react";

import { InputEditor } from "@src/components/Editors/InputEditor/InputEditor";

import { JSONProvider } from "@src/contexts/JSONContext/JSONContext";
import { EditorProvider } from "@src/contexts/EditorContext/EditorContext";

import { useJSONContext } from "@src/hooks/useJSONContext";

import { mockInputJsonState } from "@tests/jest.constants";

type RenderComponent = {
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const { container } = render(
    <JSONProvider>
      <EditorProvider>
        <InputEditor></InputEditor>
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

describe("InputEditor.tsx", () => {
  describe("General Tests.", () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();

      (useJSONContext as jest.Mock).mockReturnValue({
        state: {
          inputJson: mockInputJsonState,
        },
        dispatch: mockDispatch,
      });
    });

    test("It must render the input editor.", async () => {
      const { container } = renderComponent();

      const inputEditor =
        container.querySelector<HTMLDivElement>(".input-editor");

      expect(inputEditor).toBeInTheDocument();
    });
  });
});
