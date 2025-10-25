import { screen, render } from "@testing-library/react";
import user from "@testing-library/user-event";

import MockAdapter from "axios-mock-adapter";
import { MemoryRouter } from "react-router-dom";

import { LoadJsonPage } from "@src/pages/LoadJsonPage/LoadJsonPage";

import { JSONProvider } from "@src/contexts/JSONContext/JSONContext";
import { ModalProvider } from "@src/contexts/ModalContext/ModalContext";
import { EditorProvider } from "@src/contexts/EditorContext/EditorContext";

import { useModalContext } from "@src/hooks/useModalContext";
import { useJSONContext } from "@src/hooks/useJSONContext";
import { useEditorContext } from "@src/hooks/useEditorContext";

import { fileApi } from "@src/api/file";
import { inputApi } from "@src/api/input";

import {
  mockInputJsonNullState,
  mockInputJsonState,
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
            <LoadJsonPage></LoadJsonPage>
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

describe("LoadJsonPage.tsx", () => {
  describe("if calls are 200 but content is empty.", () => {
    const mockDispatchModal = jest.fn();
    const mockDispatchJSON = jest.fn();
    const mockDispatchEditor = jest.fn();

    const mockFile = new MockAdapter(fileApi);

    mockFile
      .onPost("/content")
      .reply(200, { data: { content: mockInputJsonNullState.content } });

    beforeEach(() => {
      jest.clearAllMocks();

      (useModalContext as jest.Mock).mockReturnValue({
        dispatch: mockDispatchModal,
      });

      (useJSONContext as jest.Mock).mockReturnValue({
        state: {
          loading: false,
          inputJson: mockInputJsonNullState,
        },
        dispatch: mockDispatchJSON,
      });

      (useEditorContext as jest.Mock).mockReturnValue({
        state: { text: mockInputJsonNullState.content },
        dispatch: mockDispatchEditor,
      });
    });

    test("It must submit the form with invalid fields.", async () => {
      const name = "1234";
      const blob = new Blob([""]);
      const file = new File([blob], "values.json", {
        type: "application/JSON",
      });

      const { container } = renderComponent();

      const inputs = Array.from(
        container.querySelectorAll<HTMLInputElement>("input")
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

      expect(mockDispatchJSON).toHaveBeenCalledTimes(2);
      expect(mockDispatchModal).toHaveBeenCalledTimes(1);
    });
  });

  describe("if calls are 200 but content is not empty.", () => {
    const mockDispatchModal = jest.fn();
    const mockDispatchJSON = jest.fn();
    const mockDispatchEditor = jest.fn();

    const mockFile = new MockAdapter(fileApi);
    const mockInput = new MockAdapter(inputApi);

    const mockRequestPostJsonUpload = { inputJson: mockInputJsonState };

    mockFile.onPost("/content").reply(200, { data: mockInputJsonState });
    mockInput.onPost("/").reply(200, { data: mockRequestPostJsonUpload });

    beforeEach(() => {
      jest.clearAllMocks();

      (useModalContext as jest.Mock).mockReturnValue({
        dispatch: mockDispatchModal,
      });

      (useJSONContext as jest.Mock).mockReturnValue({
        state: {
          loading: false,
          inputJson: mockInputJsonState,
        },
        dispatch: mockDispatchJSON,
      });

      (useEditorContext as jest.Mock).mockReturnValue({
        state: { text: JSON.stringify(mockInputJsonState.content) },
        dispatch: mockDispatchEditor,
      });
    });

    test("It must submit the form with valid fields.", async () => {
      const name = "1234";

      const blob = new Blob([JSON.stringify(mockInputJsonState.content)]);
      const file = new File([blob], "values.json", {
        type: "application/JSON",
      });

      const { container } = renderComponent();

      const inputs = Array.from(
        container.querySelectorAll<HTMLInputElement>("input")
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

      expect(mockDispatchJSON).toHaveBeenCalledTimes(4);
    });
  });

  describe("General Tests.", () => {
    const mockDispatchModal = jest.fn();
    const mockDispatchJSON = jest.fn();
    const mockDispatchEditor = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();

      (useModalContext as jest.Mock).mockReturnValue({
        dispatch: mockDispatchModal,
      });

      (useJSONContext as jest.Mock).mockReturnValue({
        state: {
          loading: false,
          inputJson: mockInputJsonNullState,
        },
        dispatch: mockDispatchJSON,
      });

      (useEditorContext as jest.Mock).mockReturnValue({
        state: { text: "" },
        dispatch: mockDispatchEditor,
      });
    });

    test("It must render the json name input and the json file input and submit button.", () => {
      const { container } = renderComponent();

      const inputs = Array.from(
        container.querySelectorAll<HTMLInputElement>("input")
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
