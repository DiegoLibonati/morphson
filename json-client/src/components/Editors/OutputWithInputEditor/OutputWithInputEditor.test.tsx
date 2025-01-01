import { render } from "@testing-library/react";

import { OutputWithInputEditor } from "./OutputWithInputEditor";

import { JSONProvider, useJSONContext } from "@/src/contexts/export";

import {
  MOCK_INPUT_JSON_STATE,
  MOCK_OUTPUT_JSON_STATE,
} from "@/src/tests/constants";

type RenderComponent = {
  container: HTMLElement;
};

const mockHandleOutputJsonContentUpdate = jest.fn();

jest.mock("../../../contexts/JSONContext/JSONContext", () => ({
  ...jest.requireActual("../../../contexts/JSONContext/JSONContext"),
  useJSONContext: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();

  (useJSONContext as jest.Mock).mockReturnValue({
    inputJson: MOCK_INPUT_JSON_STATE,
    outputJson: MOCK_OUTPUT_JSON_STATE,
    handleOutputJsonModelUpdate: mockHandleOutputJsonContentUpdate,
  });
});

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

test("It must render the output with input editor.", async () => {
  const { container } = renderComponent();

  const outputWithInputEditor = container.querySelector(
    ".output-with-input-editor"
  ) as HTMLDivElement;

  expect(outputWithInputEditor).toBeInTheDocument();
});
