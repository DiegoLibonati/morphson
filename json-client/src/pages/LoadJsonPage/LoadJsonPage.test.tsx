import { screen, render } from "@testing-library/react";
import user from "@testing-library/user-event";

import MockAdapter from "axios-mock-adapter";
import { MemoryRouter } from "react-router-dom";

import { LoadJsonPage } from "./LoadJsonPage";

import {
  JSONProvider,
  ModalProvider,
  useJSONContext,
  useModalContext,
} from "@/src/contexts/export";
import { jsonApi } from "@/src/services/axios";

import {
  mockInputJsonNullState,
  mockInputJsonState,
} from "@/src/tests/jest.constants";

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
          <LoadJsonPage></LoadJsonPage>
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

describe("LoadJsonPage.tsx", () => {
  describe("if calls are 200 but content is empty.", () => {
    const mockHandleClearJson = jest.fn();
    const mockHandleInputJsonContentUpdate = jest.fn();
    const mockHandleUpdateInputJson = jest.fn();
    const mockHandleLoading = jest.fn();
    const mockHandleSetModal = jest.fn();

    const mock = new MockAdapter(jsonApi);

    mock
      .onPost("/json/getContent")
      .reply(200, { data: { content: mockInputJsonNullState.content } });

    beforeEach(() => {
      jest.clearAllMocks();

      (useModalContext as jest.Mock).mockReturnValue({
        handleSetModal: mockHandleSetModal,
      });

      (useJSONContext as jest.Mock).mockReturnValue({
        loading: false,
        inputJson: mockInputJsonNullState,
        handleClearJson: mockHandleClearJson,
        handleInputJsonContentUpdate: mockHandleInputJsonContentUpdate,
        handleUpdateInputJson: mockHandleUpdateInputJson,
        handleLoading: mockHandleLoading,
      });
    });

    test("It must submit the form with invalid fields.", async () => {
      const name = "1234";
      const blob = new Blob([mockInputJsonNullState.content]);
      const file = new File([blob], "values.json", {
        type: "application/JSON",
      });

      const { container } = renderComponent();

      const inputs = Array.from(
        container.querySelectorAll("input") as NodeList
      );
      const inputJsonName = inputs.find((input) => {
        const i = input as HTMLInputElement;
        return i.id === "json_name";
      }) as HTMLInputElement;
      const inputJsonFile = inputs.find((input) => {
        const i = input as HTMLInputElement;
        return i.id === "json_file";
      }) as HTMLInputElement;
      const btnSubmit = screen.getByRole("button", {
        name: /submit form load json/i,
      });

      expect(inputJsonName).toBeInTheDocument();
      expect(inputJsonFile).toBeInTheDocument();
      expect(btnSubmit).toBeInTheDocument();

      await user.clear(inputJsonName);
      await user.click(inputJsonName);
      await user.keyboard(name);

      await user.upload(inputJsonFile, file);

      expect(btnSubmit).not.toBeDisabled();

      await user.click(btnSubmit);

      expect(mockHandleLoading).toHaveBeenCalledTimes(1);
      expect(mockHandleLoading).toHaveBeenCalledWith(true);
      expect(mockHandleSetModal).toHaveBeenCalledTimes(1);
      expect(mockHandleSetModal).toHaveBeenCalledWith({
        message: "You must send a valid name, content and file.",
        open: true,
      });
    });
  });

  describe("if calls are 200 but content is not empty.", () => {
    const mockHandleClearJson = jest.fn();
    const mockHandleInputJsonContentUpdate = jest.fn();
    const mockHandleUpdateInputJson = jest.fn();
    const mockHandleLoading = jest.fn();
    const mockHandleSetModal = jest.fn();

    const mock = new MockAdapter(jsonApi);

    const mockRequestPostJsonUpload = { json: mockInputJsonState };

    mock.onPost("/json/getContent").reply(200, { data: mockInputJsonState });
    mock.onPost("/json/upload").reply(200, { data: mockRequestPostJsonUpload });

    beforeEach(() => {
      jest.clearAllMocks();

      (useModalContext as jest.Mock).mockReturnValue({
        handleSetModal: mockHandleSetModal,
      });

      (useJSONContext as jest.Mock).mockReturnValue({
        loading: false,
        inputJson: mockInputJsonState,
        handleClearJson: mockHandleClearJson,
        handleInputJsonContentUpdate: mockHandleInputJsonContentUpdate,
        handleUpdateInputJson: mockHandleUpdateInputJson,
        handleLoading: mockHandleLoading,
      });
    });

    test("It must submit the form with valid fields.", async () => {
      const name = "1234";

      const blob = new Blob([mockInputJsonState.content]);
      const file = new File([blob], "values.json", {
        type: "application/JSON",
      });

      const { container } = renderComponent();

      const inputs = Array.from(
        container.querySelectorAll("input") as NodeList
      );
      const inputJsonName = inputs.find((input) => {
        const i = input as HTMLInputElement;
        return i.id === "json_name";
      }) as HTMLInputElement;
      const inputJsonFile = inputs.find((input) => {
        const i = input as HTMLInputElement;
        return i.id === "json_file";
      }) as HTMLInputElement;
      const btnSubmit = screen.getByRole("button", {
        name: /submit form load json/i,
      });

      expect(inputJsonName).toBeInTheDocument();
      expect(inputJsonFile).toBeInTheDocument();
      expect(btnSubmit).toBeInTheDocument();

      await user.clear(inputJsonName);
      await user.click(inputJsonName);
      await user.keyboard(name);

      await user.upload(inputJsonFile, file);

      expect(btnSubmit).not.toBeDisabled();

      await user.click(btnSubmit);

      expect(mockHandleLoading).toHaveBeenCalledTimes(2);
      expect(mockHandleLoading).toHaveBeenCalledWith(true);
      expect(mockHandleLoading).toHaveBeenCalledWith(false);
      expect(mockHandleUpdateInputJson).toHaveBeenCalledTimes(1);
      expect(mockHandleUpdateInputJson).toHaveBeenCalledWith({
        id: mockRequestPostJsonUpload.json.id,
        name: name,
        file: file,
        content: mockInputJsonState.content,
        keys: [],
      });
    });
  });

  describe("General Tests.", () => {
    const mockHandleClearJson = jest.fn();
    const mockHandleInputJsonContentUpdate = jest.fn();
    const mockHandleUpdateInputJson = jest.fn();
    const mockHandleLoading = jest.fn();
    const mockHandleSetModal = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();

      (useModalContext as jest.Mock).mockReturnValue({
        handleSetModal: mockHandleSetModal,
      });

      (useJSONContext as jest.Mock).mockReturnValue({
        loading: false,
        inputJson: mockInputJsonNullState,
        handleClearJson: mockHandleClearJson,
        handleInputJsonContentUpdate: mockHandleInputJsonContentUpdate,
        handleUpdateInputJson: mockHandleUpdateInputJson,
        handleLoading: mockHandleLoading,
      });
    });

    test("It must render the json name input and the json file input and submit button.", () => {
      const { container } = renderComponent();

      const inputs = Array.from(
        container.querySelectorAll("input") as NodeList
      );
      const inputJsonName = inputs.find((input) => {
        const i = input as HTMLInputElement;
        return i.id === "json_name";
      }) as HTMLInputElement;
      const inputJsonFile = inputs.find((input) => {
        const i = input as HTMLInputElement;
        return i.id === "json_file";
      }) as HTMLInputElement;
      const btnSubmit = screen.getByRole("button", {
        name: /submit form load json/i,
      });

      expect(inputJsonName).toBeInTheDocument();
      expect(inputJsonFile).toBeInTheDocument();
      expect(btnSubmit).toBeInTheDocument();
      expect(btnSubmit).toBeDisabled();
      expect(btnSubmit).toHaveTextContent("Upload JSON");
    });
  });
});
