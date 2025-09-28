import { render } from "@testing-library/react";

import { InputEditor } from "@src/components/Editors/InputEditor/InputEditor";

import {
  EditorProvider,
  JSONProvider,
  useJSONContext,
} from "@src/contexts/export";

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

jest.mock("@src/contexts/JSONContext/JSONContext", () => ({
  ...jest.requireActual("@src/contexts/JSONContext/JSONContext"),
  useJSONContext: jest.fn(),
}));

describe("InputEditor.tsx", () => {
  describe("General Tests.", () => {
    const mockHandleInputJsonContentUpdate = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();

      (useJSONContext as jest.Mock).mockReturnValue({
        inputJson: mockInputJsonState,
        handleInputJsonContentUpdate: mockHandleInputJsonContentUpdate,
      });
    });

    test("It must render the input editor.", async () => {
      const { container } = renderComponent();

      const inputEditor = container.querySelector(
        ".input-editor"
      ) as HTMLDivElement;

      expect(inputEditor).toBeInTheDocument();
    });
  });
});
