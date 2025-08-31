import { screen, render, within } from "@testing-library/react";
import user from "@testing-library/user-event";

import MockAdapter from "axios-mock-adapter";
import { MemoryRouter } from "react-router-dom";

import { TransformJsonPage } from "./TransformJsonPage";

import {
  JSONProvider,
  ModalProvider,
  useJSONContext,
  useModalContext,
} from "@/src/contexts/export";
import { jsonApi } from "@/src/services/axios";

import {
  mockInputJsonNullState,
  mockInputJsons,
  mockOutputJsonNullState,
  mockOutputJsons,
} from "@/tests/jest.constants";

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
          <TransformJsonPage></TransformJsonPage>
        </ModalProvider>
      </JSONProvider>
    </MemoryRouter>
  );

  return {
    container: container,
  };
};

jest.mock("../../contexts/ModalContext/ModalContext", () => ({
  ...jest.requireActual("../../contexts/ModalContext/ModalContext"),
  useModalContext: jest.fn(),
}));

jest.mock("../../contexts/JSONContext/JSONContext", () => ({
  ...jest.requireActual("../../contexts/JSONContext/JSONContext"),
  useJSONContext: jest.fn(),
}));

describe("TransformJsonPage.tsx", () => {
  describe("General Tests.", () => {
    const mockHandleLoading = jest.fn();
    const mockHandleFillJsons = jest.fn();
    const mockHandleClearJson = jest.fn();
    const mockHandleUpdateInputJson = jest.fn();
    const mockHandleUpdateOutputJson = jest.fn();
    const mockHandleSetModal = jest.fn();

    const mock = new MockAdapter(jsonApi);

    mock.onGet("/json/inputs").reply(200, { data: mockInputJsons });
    mock.onGet("/json/outputs").reply(200, { data: mockOutputJsons });

    beforeEach(() => {
      jest.clearAllMocks();

      (useModalContext as jest.Mock).mockReturnValue({
        handleSetModal: mockHandleSetModal,
      });

      (useJSONContext as jest.Mock).mockReturnValue({
        loading: false,
        inputJson: mockInputJsonNullState,
        outputJson: mockOutputJsonNullState,
        jsons: {
          inputJsons: mockInputJsons,
          outputJsons: mockOutputJsons,
        },
        handleLoading: mockHandleLoading,
        handleFillJsons: mockHandleFillJsons,
        handleClearJson: mockHandleClearJson,
        handleUpdateInputJson: mockHandleUpdateInputJson,
        handleUpdateOutputJson: mockHandleUpdateOutputJson,
      });
    });

    test("It must render the jsons input select with the options.", () => {
      const { container } = renderComponent();

      const selects = Array.from(
        container.querySelectorAll("select") as NodeList
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
    const mockHandleLoading = jest.fn();
    const mockHandleFillJsons = jest.fn();
    const mockHandleClearJson = jest.fn();
    const mockHandleUpdateInputJson = jest.fn();
    const mockHandleUpdateOutputJson = jest.fn();
    const mockHandleSetModal = jest.fn();

    const inputJsonSelected = mockInputJsons[0];
    const outputJsonSelected = mockOutputJsons[0];

    const mock = new MockAdapter(jsonApi);

    mock.onGet("/json/inputs").reply(200, { data: mockInputJsons });
    mock.onGet("/json/outputs").reply(200, { data: mockOutputJsons });
    mock.onGet(`/json/input/${inputJsonSelected.id}`).reply(200, {
      data: {
        inputJson: inputJsonSelected,
      },
    });
    mock.onGet(`/json/output/${outputJsonSelected.id}`).reply(200, {
      data: {
        outputJson: outputJsonSelected,
      },
    });

    beforeEach(() => {
      jest.clearAllMocks();

      (useModalContext as jest.Mock).mockReturnValue({
        handleSetModal: mockHandleSetModal,
      });

      (useJSONContext as jest.Mock).mockReturnValue({
        loading: false,
        inputJson: mockInputJsonNullState,
        outputJson: mockOutputJsonNullState,
        jsons: {
          inputJsons: mockInputJsons,
          outputJsons: mockOutputJsons,
        },
        handleLoading: mockHandleLoading,
        handleFillJsons: mockHandleFillJsons,
        handleClearJson: mockHandleClearJson,
        handleUpdateInputJson: mockHandleUpdateInputJson,
        handleUpdateOutputJson: mockHandleUpdateOutputJson,
      });
    });

    test("It must choose an option from the json input select.", async () => {
      const { container } = renderComponent();

      const selects = Array.from(
        container.querySelectorAll("select") as NodeList
      );
      const selectInputJsons = selects.find((select) => {
        const s = select as HTMLSelectElement;

        return s.id === "json_input_select";
      }) as HTMLSelectElement;

      expect(selectInputJsons).toBeInTheDocument();

      await user.selectOptions(selectInputJsons, String(inputJsonSelected.id));

      expect(mockHandleLoading).toHaveBeenCalledTimes(4);
      expect(mockHandleLoading).toHaveBeenCalledWith(true);
      expect(mockHandleLoading).toHaveBeenCalledWith(false);
      expect(mockHandleSetModal).toHaveBeenCalledTimes(1);
      expect(mockHandleSetModal).toHaveBeenCalledWith({
        open: true,
        message:
          "Now you can use the key: input followed by a dot to get the keys from the json input and then transform them into values of those keys.",
      });
      expect(mockHandleUpdateInputJson).toHaveBeenCalledTimes(1);
      expect(mockHandleUpdateInputJson).toHaveBeenCalledWith({
        id: inputJsonSelected.id,
        name: inputJsonSelected.name,
        content: inputJsonSelected.content,
        keys: inputJsonSelected.keys,
        file: null,
      });
    });

    test("It must choose an option from the json output select.", async () => {
      const { container } = renderComponent();

      const selects = Array.from(
        container.querySelectorAll("select") as NodeList
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

      expect(mockHandleLoading).toHaveBeenCalledTimes(4);
      expect(mockHandleLoading).toHaveBeenCalledWith(true);
      expect(mockHandleLoading).toHaveBeenCalledWith(false);
      expect(mockHandleSetModal).toHaveBeenCalledTimes(1);
      expect(mockHandleSetModal).toHaveBeenCalledWith({
        open: true,
        message: "Successfully loaded the output json!",
      });
      expect(mockHandleUpdateOutputJson).toHaveBeenCalledTimes(1);
      expect(mockHandleUpdateOutputJson).toHaveBeenCalledWith({
        id: outputJsonSelected.id,
        name: outputJsonSelected.name,
        model: outputJsonSelected.model,
      });
    });
  });
});
