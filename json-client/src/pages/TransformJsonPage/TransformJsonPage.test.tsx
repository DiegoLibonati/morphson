import { screen, render, within } from "@testing-library/react";
import user from "@testing-library/user-event";

import MockAdapter from "axios-mock-adapter";
import { MemoryRouter } from "react-router-dom";

import { TransformJsonPage } from "@src/pages/TransformJsonPage/TransformJsonPage";

import { useModalContext } from "@src/hooks/useModalContext";
import { useJSONContext } from "@src/hooks/useJSONContext";
import { useEditorContext } from "@src/hooks/useEditorContext";

import { JSONProvider } from "@src/contexts/JSONContext/JSONContext";
import { ModalProvider } from "@src/contexts/ModalContext/ModalContext";
import { EditorProvider } from "@src/contexts/EditorContext/EditorContext";

import { inputApi } from "@src/api/input";
import { outputApi } from "@src/api/output";

import {
  mockInputJsonNullState,
  mockInputJsons,
  mockOutputJsonNullState,
  mockOutputJsons,
} from "@tests/jest.constants";

type RenderComponent = {
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const { container } = render(
    <MemoryRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <JSONProvider>
        <ModalProvider>
          <EditorProvider>
            <TransformJsonPage></TransformJsonPage>
          </EditorProvider>
        </ModalProvider>
      </JSONProvider>
    </MemoryRouter>
  );

  return {
    container: container,
  };
};

jest.mock("@src/hooks/useModalContext", () => ({
  ...jest.requireActual("@src/hooks/useModalContext"),
  useModalContext: jest.fn(),
}));

jest.mock("@src/hooks/useJSONContext", () => ({
  ...jest.requireActual("@src/hooks/useJSONContext"),
  useJSONContext: jest.fn(),
}));

jest.mock("@src/hooks/useEditorContext", () => ({
  ...jest.requireActual("@src/hooks/useEditorContext"),
  useEditorContext: jest.fn(),
}));

describe("TransformJsonPage.tsx", () => {
  describe("General Tests.", () => {
    const mockDispatchModal = jest.fn();
    const mockDispatchJSON = jest.fn();
    const mockDispatchEditor = jest.fn();

    const mockInput = new MockAdapter(inputApi);
    const mockOutput = new MockAdapter(outputApi);

    mockInput.onGet("/").reply(200, { data: mockInputJsons });
    mockOutput.onGet("/").reply(200, { data: mockOutputJsons });

    beforeEach(() => {
      jest.clearAllMocks();

      (useModalContext as jest.Mock).mockReturnValue({
        dispatch: mockDispatchModal,
      });

      (useJSONContext as jest.Mock).mockReturnValue({
        state: {
          loading: false,
          inputJson: mockInputJsonNullState,
          outputJson: mockOutputJsonNullState,
          jsons: {
            inputJsons: mockInputJsons,
            outputJsons: mockOutputJsons,
          },
        },
        dispatch: mockDispatchJSON,
      });

      (useEditorContext as jest.Mock).mockReturnValue({
        state: { text: "" },
        dispatch: mockDispatchEditor,
      });
    });

    test("It must render the jsons input select with the options.", () => {
      const { container } = renderComponent();

      const selects = Array.from(
        container.querySelectorAll<HTMLSelectElement>("select")
      );
      const selectInputJsons = selects.find((select) => {
        const s = select as HTMLSelectElement;

        return s.id === "json_input_select";
      }) as HTMLSelectElement;

      expect(selectInputJsons).toBeInTheDocument();

      const options = within(selectInputJsons).getAllByRole("option");

      for (const option of options) {
        expect(option).toBeInTheDocument();
      }
    });

    test("It must render the input check to save a json output.", () => {
      renderComponent();

      const inputCheck = screen.getByRole("checkbox", {
        name: /Do you want to save the json output for future transformations?/i,
      });

      expect(inputCheck).toBeInTheDocument();
    });

    test("It should render the input name if you click on the input check to save the output.", async () => {
      renderComponent();

      const inputCheck = screen.getByRole("checkbox", {
        name: /Do you want to save the json output for future transformations?/i,
      });
      const inputName = screen.queryByRole("textbox");

      expect(inputCheck).toBeInTheDocument();
      expect(inputName).not.toBeInTheDocument();

      await user.click(inputCheck);

      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    test("It must render the submit button.", () => {
      renderComponent();

      const btnSubmit = screen.getByRole("button", { name: /transform json/i });

      expect(btnSubmit).toBeInTheDocument();
      expect(btnSubmit).toHaveTextContent("Transform JSON");
      expect(btnSubmit).toBeDisabled();
    });
  });

  describe("if calls are 200.", () => {
    const mockDispatchModal = jest.fn();
    const mockDispatchJSON = jest.fn();
    const mockDispatchEditor = jest.fn();

    const inputJsonSelected = mockInputJsons[0];
    const outputJsonSelected = mockOutputJsons[0];

    const mockInput = new MockAdapter(inputApi);
    const mockOutput = new MockAdapter(outputApi);

    mockInput.onGet("").reply(200, { data: mockInputJsons });
    mockOutput.onGet("").reply(200, { data: mockOutputJsons });
    mockInput.onGet(`/${inputJsonSelected.id}`).reply(200, {
      data: {
        inputJson: inputJsonSelected,
      },
    });
    mockOutput.onGet(`/${outputJsonSelected.id}`).reply(200, {
      data: {
        outputJson: outputJsonSelected,
      },
    });

    beforeEach(() => {
      jest.clearAllMocks();

      (useModalContext as jest.Mock).mockReturnValue({
        dispatch: mockDispatchModal,
      });

      (useJSONContext as jest.Mock).mockReturnValue({
        state: {
          loading: false,
          inputJson: mockInputJsonNullState,
          outputJson: mockOutputJsonNullState,
          jsons: {
            inputJsons: mockInputJsons,
            outputJsons: mockOutputJsons,
          },
        },
        dispatch: mockDispatchJSON,
      });

      (useEditorContext as jest.Mock).mockReturnValue({
        state: { text: "" },
        dispatch: mockDispatchEditor,
      });
    });

    test("It must choose an option from the json input select.", async () => {
      const { container } = renderComponent();

      const selects = Array.from(
        container.querySelectorAll<HTMLSelectElement>("select")
      );
      const selectInputJsons = selects.find((select) => {
        const s = select as HTMLSelectElement;

        return s.id === "json_input_select";
      }) as HTMLSelectElement;

      expect(selectInputJsons).toBeInTheDocument();

      await user.selectOptions(selectInputJsons, String(inputJsonSelected.id));

      expect(mockDispatchJSON).toHaveBeenCalledTimes(6);
      expect(mockDispatchModal).toHaveBeenCalledTimes(1);
    });

    test("It must choose an option from the json output select.", async () => {
      const { container } = renderComponent();

      const selects = Array.from(
        container.querySelectorAll<HTMLSelectElement>("select")
      );
      const selectOutputJsons = selects.find((select) => {
        const s = select as HTMLSelectElement;

        return s.id === "json_output_select";
      }) as HTMLSelectElement;

      expect(selectOutputJsons).toBeInTheDocument();

      await user.selectOptions(
        selectOutputJsons,
        String(outputJsonSelected.id)
      );

      expect(mockDispatchJSON).toHaveBeenCalledTimes(6);
      expect(mockDispatchModal).toHaveBeenCalledTimes(1);
      expect(mockDispatchEditor).toHaveBeenCalledTimes(1);
    });
  });
});
