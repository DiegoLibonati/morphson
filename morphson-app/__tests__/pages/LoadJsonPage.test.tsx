import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import type { JSX } from "react";
import type { RenderResult } from "@testing-library/react";
import type { OnChange } from "@monaco-editor/react";

import LoadJsonPage from "@/pages/LoadJsonPage/LoadJsonPage";
import ModalAlert from "@/components/Modals/ModalAlert/ModalAlert";

import { JSONProvider } from "@/contexts/JSONContext/JSONProvider";
import { EditorProvider } from "@/contexts/EditorContext/EditorProvider";
import { ModalProvider } from "@/contexts/ModalContext/ModalProvider";

import inputService from "@/services/inputService";
import fileService from "@/services/fileService";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual<Record<string, unknown>>("react-router-dom"),
  useNavigate: (): jest.Mock => mockNavigate,
}));

jest.mock("@/services/inputService", () => ({
  __esModule: true,
  default: {
    upload: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
  },
}));

jest.mock("@/services/fileService", () => ({
  __esModule: true,
  default: {
    getContent: jest.fn(),
  },
}));

jest.mock("@monaco-editor/react", () => ({
  Editor: ({ value, onChange }: { value: string; onChange?: OnChange }): JSX.Element => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange?.(e.target.value, undefined as never)}
    />
  ),
}));

const renderPage = (): RenderResult =>
  render(
    <MemoryRouter>
      <ModalProvider>
        <JSONProvider>
          <EditorProvider>
            <LoadJsonPage />
          </EditorProvider>
        </JSONProvider>
      </ModalProvider>
    </MemoryRouter>
  );

describe("LoadJsonPage", () => {
  describe("rendering", () => {
    it("should render the JSON Name input", () => {
      renderPage();
      expect(screen.getByLabelText("JSON Name")).toBeInTheDocument();
    });

    it("should render the Upload JSON file input", () => {
      renderPage();
      expect(screen.getByLabelText("Upload JSON")).toBeInTheDocument();
    });

    it("should render the Submit button", () => {
      renderPage();
      expect(screen.getByRole("button", { name: "Submit Form Load Json" })).toBeInTheDocument();
    });

    it("should render the monaco editor", () => {
      renderPage();
      expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
    });

    it("should render the Home back link", () => {
      renderPage();
      expect(screen.getByRole("link", { name: "Go to Home" })).toBeInTheDocument();
    });
  });

  describe("form validation", () => {
    it("should have the submit button disabled when name is empty", () => {
      renderPage();
      expect(screen.getByRole("button", { name: "Submit Form Load Json" })).toBeDisabled();
    });

    it("should enable submit button when name is filled and editor content matches parsed json", async () => {
      const user = userEvent.setup();
      renderPage();

      await user.type(screen.getByLabelText("JSON Name"), "my-json");
      fireEvent.change(screen.getByTestId("monaco-editor"), { target: { value: "{}" } });

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Submit Form Load Json" })).not.toBeDisabled();
      });
    });
  });

  describe("file upload", () => {
    it("should call fileService.getContent when a file is selected", async () => {
      const user = userEvent.setup();
      (fileService.getContent as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: '{"name":"test"}',
      });

      const { container } = renderPage();

      const file = new File(['{"name":"test"}'], "test.json", { type: "application/json" });
      const fileInput = container.querySelector<HTMLInputElement>("input[type='file']");

      if (fileInput) {
        await user.upload(fileInput, file);
      }

      await waitFor(() => {
        expect(fileService.getContent).toHaveBeenCalled();
      });
    });
  });

  describe("form submission", () => {
    it("should call inputService.upload and navigate on successful submission", async () => {
      const user = userEvent.setup();

      (fileService.getContent as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: '{"key":"value"}',
      });
      (inputService.upload as jest.Mock).mockResolvedValue({
        code: "201",
        message: "Created",
        data: {
          inputJson: {
            id: 1,
            name: "my-json",
            content: { key: "value" },
            keys: ["key"],
            keysAndValues: { key: "value" },
            createdAt: null,
            updatedAt: null,
          },
        },
      });

      const { container } = renderPage();

      await user.type(screen.getByLabelText("JSON Name"), "my-json");

      const file = new File(['{"key":"value"}'], "data.json", { type: "application/json" });
      const fileInput = container.querySelector<HTMLInputElement>("input[type='file']");
      if (fileInput) await user.upload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByTestId("monaco-editor")).toHaveValue('{"key":"value"}');
      });

      fireEvent.change(screen.getByTestId("monaco-editor"), {
        target: { value: '{"key":"value"}' },
      });

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Submit Form Load Json" })).not.toBeDisabled();
      });

      await user.click(screen.getByRole("button", { name: "Submit Form Load Json" }));

      await waitFor(() => {
        expect(inputService.upload).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining("/json/resolution/uploaded")
        );
      });
    });

    it("should have submit button disabled when name is empty regardless of editor content", async () => {
      renderPage();

      fireEvent.change(screen.getByTestId("monaco-editor"), { target: { value: "{}" } });

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Submit Form Load Json" })).toBeDisabled();
      });
    });

    it("should show modal when no file is selected at submission", async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter>
          <ModalProvider>
            <ModalAlert />
            <JSONProvider>
              <EditorProvider>
                <LoadJsonPage />
              </EditorProvider>
            </JSONProvider>
          </ModalProvider>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText("JSON Name"), "my-json");

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Submit Form Load Json" })).not.toBeDisabled();
      });

      await user.click(screen.getByRole("button", { name: "Submit Form Load Json" }));

      await waitFor(() => {
        expect(
          screen.getByText("You must send a valid name, content and file.")
        ).toBeInTheDocument();
      });
    });
  });

  describe("error handling", () => {
    it("should show the API message when fileService.getContent throws an axios error response", async () => {
      const user = userEvent.setup();
      const axiosErr = Object.assign(new Error("Request failed"), {
        response: { status: 400, data: { message: "Invalid file" } },
        isAxiosError: true,
      });
      (fileService.getContent as jest.Mock).mockRejectedValue(axiosErr);

      const { container } = render(
        <MemoryRouter>
          <ModalProvider>
            <ModalAlert />
            <JSONProvider>
              <EditorProvider>
                <LoadJsonPage />
              </EditorProvider>
            </JSONProvider>
          </ModalProvider>
        </MemoryRouter>
      );

      const file = new File(["{}"], "test.json", { type: "application/json" });
      const fileInput = container.querySelector<HTMLInputElement>("input[type='file']");
      if (fileInput) await user.upload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText("Invalid file")).toBeInTheDocument();
      });
    });

    it("should show the API message when inputService.upload throws an axios error response", async () => {
      const user = userEvent.setup();
      (fileService.getContent as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: '{"k":"v"}',
      });
      const axiosErr = Object.assign(new Error("Request failed"), {
        response: { status: 409, data: { message: "Name already taken" } },
        isAxiosError: true,
      });
      (inputService.upload as jest.Mock).mockRejectedValue(axiosErr);

      const { container } = render(
        <MemoryRouter>
          <ModalProvider>
            <ModalAlert />
            <JSONProvider>
              <EditorProvider>
                <LoadJsonPage />
              </EditorProvider>
            </JSONProvider>
          </ModalProvider>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText("JSON Name"), "my-json");
      const fileInput = container.querySelector<HTMLInputElement>("input[type='file']");
      const file = new File(['{"k":"v"}'], "data.json", { type: "application/json" });
      if (fileInput) await user.upload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByTestId("monaco-editor")).toHaveValue('{"k":"v"}');
      });
      fireEvent.change(screen.getByTestId("monaco-editor"), { target: { value: '{"k":"v"}' } });

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Submit Form Load Json" })).not.toBeDisabled();
      });

      await user.click(screen.getByRole("button", { name: "Submit Form Load Json" }));

      await waitFor(() => {
        expect(screen.getByText("Name already taken")).toBeInTheDocument();
      });
    });

    it("should show modal when fileService.getContent throws an unexpected error", async () => {
      const user = userEvent.setup();
      (fileService.getContent as jest.Mock).mockRejectedValue(new Error("Unexpected"));

      const { container } = render(
        <MemoryRouter>
          <ModalProvider>
            <ModalAlert />
            <JSONProvider>
              <EditorProvider>
                <LoadJsonPage />
              </EditorProvider>
            </JSONProvider>
          </ModalProvider>
        </MemoryRouter>
      );

      const file = new File(["{}"], "test.json", { type: "application/json" });
      const fileInput = container.querySelector<HTMLInputElement>("input[type='file']");
      if (fileInput) await user.upload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
      });
    });

    it("should show modal when inputService.upload throws an unexpected error", async () => {
      const user = userEvent.setup();
      (fileService.getContent as jest.Mock).mockResolvedValue({
        code: "200",
        message: "OK",
        data: '{"k":"v"}',
      });
      (inputService.upload as jest.Mock).mockRejectedValue(new Error("Unexpected"));

      const { container } = render(
        <MemoryRouter>
          <ModalProvider>
            <ModalAlert />
            <JSONProvider>
              <EditorProvider>
                <LoadJsonPage />
              </EditorProvider>
            </JSONProvider>
          </ModalProvider>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText("JSON Name"), "my-json");
      const fileInput = container.querySelector<HTMLInputElement>("input[type='file']");
      const file = new File(['{"k":"v"}'], "data.json", { type: "application/json" });
      if (fileInput) await user.upload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByTestId("monaco-editor")).toHaveValue('{"k":"v"}');
      });
      fireEvent.change(screen.getByTestId("monaco-editor"), { target: { value: '{"k":"v"}' } });

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Submit Form Load Json" })).not.toBeDisabled();
      });

      await user.click(screen.getByRole("button", { name: "Submit Form Load Json" }));

      await waitFor(() => {
        expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
      });
    });
  });
});
