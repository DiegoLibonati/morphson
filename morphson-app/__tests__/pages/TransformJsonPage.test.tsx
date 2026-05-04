import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import type { JSX } from "react";
import type { RenderResult } from "@testing-library/react";
import type { OnChange, OnMount } from "@monaco-editor/react";

import TransformJsonPage from "@/pages/TransformJsonPage/TransformJsonPage";
import ModalAlert from "@/components/Modals/ModalAlert/ModalAlert";

import { JSONProvider } from "@/contexts/JSONContext/JSONProvider";
import { EditorProvider } from "@/contexts/EditorContext/EditorProvider";
import { ModalProvider } from "@/contexts/ModalContext/ModalProvider";

import inputService from "@/services/inputService";
import outputService from "@/services/outputService";

import { mockInputJson } from "@tests/__mocks__/inputJson.mock";
import { mockOutputJson } from "@tests/__mocks__/outputJson.mock";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual<Record<string, unknown>>("react-router-dom"),
  useNavigate: (): jest.Mock => mockNavigate,
}));

jest.mock("@/services/inputService", () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    getById: jest.fn(),
    upload: jest.fn(),
  },
}));

jest.mock("@/services/outputService", () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    getById: jest.fn(),
  },
}));

jest.mock("@/services/transformService", () => ({
  __esModule: true,
  default: {
    transform: jest.fn(),
  },
}));

jest.mock("@monaco-editor/react", () => ({
  Editor: ({
    value,
    onChange,
    onMount,
  }: {
    value: string;
    onChange?: OnChange;
    onMount?: OnMount;
  }): JSX.Element => {
    const mockMonaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose: jest.fn() })),
        CompletionItemKind: { Function: 1 },
        CompletionItemInsertTextRule: { InsertAsSnippet: 4 },
      },
    } as never;
    if (onMount) onMount({} as never, mockMonaco);
    return (
      <textarea
        data-testid="monaco-editor"
        value={value}
        onChange={(e) => onChange?.(e.target.value, undefined as never)}
      />
    );
  },
}));

const renderPage = (): RenderResult =>
  render(
    <MemoryRouter>
      <ModalProvider>
        <ModalAlert />
        <JSONProvider>
          <EditorProvider>
            <TransformJsonPage />
          </EditorProvider>
        </JSONProvider>
      </ModalProvider>
    </MemoryRouter>
  );

describe("TransformJsonPage", () => {
  describe("rendering", () => {
    it("should render the Select an Input JSON select", async () => {
      (inputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [],
      });
      (outputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [],
      });

      renderPage();

      await waitFor(() => {
        expect(screen.getByRole("combobox", { name: "Select an Input JSON" })).toBeInTheDocument();
      });
    });

    it("should render the monaco editor", async () => {
      (inputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [],
      });
      (outputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [],
      });

      renderPage();

      await waitFor(() => {
        expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
      });
    });

    it("should render the Transform JSON submit button", async () => {
      (inputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [],
      });
      (outputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [],
      });

      renderPage();

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Submit Form Transform Json" })
        ).toBeInTheDocument();
      });
    });

    it("should load input jsons from service on mount", async () => {
      (inputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [mockInputJson],
      });
      (outputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [],
      });

      renderPage();

      await waitFor(() => {
        expect(screen.getByRole("option", { name: "input.json" })).toBeInTheDocument();
      });
    });

    it("should not show the output json select when no output jsons exist", async () => {
      (inputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [],
      });
      (outputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [],
      });

      renderPage();

      await waitFor(() => {
        expect(
          screen.queryByRole("combobox", { name: "Select an Output JSON" })
        ).not.toBeInTheDocument();
      });
    });

    it("should show the output json select when output jsons exist", async () => {
      (inputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [],
      });
      (outputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [mockOutputJson],
      });

      renderPage();

      await waitFor(() => {
        expect(screen.getByRole("combobox", { name: "Select an Output JSON" })).toBeInTheDocument();
      });
    });
  });

  describe("save output checkbox", () => {
    it("should not show the output name input by default", async () => {
      (inputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [],
      });
      (outputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [],
      });

      renderPage();

      await waitFor(() => {
        expect(screen.queryByLabelText("Output Json Name")).not.toBeInTheDocument();
      });
    });

    it("should show the output name input when checkbox is checked", async () => {
      const user = userEvent.setup();
      (inputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [],
      });
      (outputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [],
      });

      renderPage();

      await waitFor(() => {
        expect(screen.getByRole("checkbox")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("checkbox"));

      await waitFor(() => {
        expect(screen.getByLabelText("Output Json Name")).toBeInTheDocument();
      });
    });
  });

  describe("error handling", () => {
    it("should show modal when getAll services fail", async () => {
      (inputService.getAll as jest.Mock).mockRejectedValue(new Error("Network error"));
      (outputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [],
      });

      renderPage();

      await waitFor(() => {
        expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
      });
    });
  });

  describe("selecting an input json", () => {
    it("should call inputService.getById when an input json is selected", async () => {
      const user = userEvent.setup();
      (inputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [mockInputJson],
      });
      (outputService.getAll as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: [],
      });
      (inputService.getById as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: { inputJson: mockInputJson },
      });

      renderPage();

      await waitFor(() => {
        expect(screen.getByRole("option", { name: "input.json" })).toBeInTheDocument();
      });

      await user.selectOptions(screen.getByRole("combobox", { name: "Select an Input JSON" }), "1");

      await waitFor(() => {
        expect(inputService.getById).toHaveBeenCalledWith("1");
      });
    });
  });
});
