import { render } from "@testing-library/react";

import { OutputWithInputEditor } from "./OutputWithInputEditor";

import { JSONProvider, useJSONContext } from "@/src/contexts/export";

import {
  mockInputJsonState,
  mockOutputJsonState,
} from "@/tests/jest.constants";

type RenderComponent = {
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const { container } = render(
    <JSONProvider>
      <OutputWithInputEditor></OutputWithInputEditor>
    </JSONProvider>
  );

  return {
    container: container,
  };
};

jest.mock("../../../contexts/JSONContext/JSONContext", () => ({
  ...jest.requireActual("../../../contexts/JSONContext/JSONContext"),
  useJSONContext: jest.fn(),
}));

describe("OutputWithInputEditor.tsx", () => {
  describe("General Tests.", () => {
    const mockHandleOutputJsonContentUpdate = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();

      (useJSONContext as jest.Mock).mockReturnValue({
        inputJson: mockInputJsonState,
        outputJson: mockOutputJsonState,
        handleOutputJsonModelUpdate: mockHandleOutputJsonContentUpdate,
      });
    });

    test("It must render the output with input editor.", async () => {
      const { container } = renderComponent();

      const outputWithInputEditor = container.querySelector(
        ".output-with-input-editor"
      ) as HTMLDivElement;

      expect(outputWithInputEditor).toBeInTheDocument();
    });
  });
});
