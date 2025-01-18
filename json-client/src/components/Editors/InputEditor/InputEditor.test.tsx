import { render } from "@testing-library/react";

import { InputEditor } from "./InputEditor";

import { JSONProvider, useJSONContext } from "@/src/contexts/export";

import { mockInputJsonState } from "@/src/tests/jest.constants";

type RenderComponent = {
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const { container } = render(
    <JSONProvider>
      <InputEditor></InputEditor>
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
