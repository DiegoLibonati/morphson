import { render } from "@testing-library/react";

import { InputEditor } from "./InputEditor";

import { JSONProvider, useJSONContext } from "@/src/contexts/export";

import { MOCK_INPUT_JSON_STATE } from "@/src/tests/constants";

type RenderComponent = {
  container: HTMLElement;
};

const mockHandleInputJsonContentUpdate = jest.fn();

jest.mock("../../../contexts/JSONContext/JSONContext", () => ({
  ...jest.requireActual("../../../contexts/JSONContext/JSONContext"),
  useJSONContext: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();

  (useJSONContext as jest.Mock).mockReturnValue({
    inputJson: MOCK_INPUT_JSON_STATE,
    handleInputJsonContentUpdate: mockHandleInputJsonContentUpdate,
  });
});

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

test("It must render the input editor.", async () => {
  const { container } = renderComponent();

  const inputEditor = container.querySelector(
    ".input-editor"
  ) as HTMLDivElement;

  expect(inputEditor).toBeInTheDocument();
});
