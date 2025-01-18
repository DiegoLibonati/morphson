import { screen, render } from "@testing-library/react";
import user from "@testing-library/user-event";

import { MemoryRouter } from "react-router-dom";

import { FormEditorLayout } from "./FormEditorLayout";

import { JSONProvider } from "@/src/contexts/export";

type RenderComponent = {
  props: {
    loading: boolean;
    jsonTypeToEdit: "input" | "outputWithInput";
    LoadingComponent: React.ComponentType;
    mockOnSubmit: jest.Mock;
  };
  container: HTMLElement;
};

interface RenderComponentProps {
  loading: boolean;
  jsonTypeToEdit: "input" | "outputWithInput";
}

const renderComponent = ({
  loading,
  jsonTypeToEdit,
}: RenderComponentProps): RenderComponent => {
  const props = {
    loading: loading,
    jsonTypeToEdit: jsonTypeToEdit,
    LoadingComponent: () => <h2>Loading...</h2>,
    mockOnSubmit: jest.fn((e) => e.preventDefault()),
  };

  const { container } = render(
    <MemoryRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <JSONProvider>
        <FormEditorLayout
          loading={props.loading}
          LoadingComponent={props.LoadingComponent}
          jsonTypeToEdit={props.jsonTypeToEdit}
          onSubmit={props.mockOnSubmit}
        >
          <button type="submit" aria-label="submit form"></button>
        </FormEditorLayout>
      </JSONProvider>
    </MemoryRouter>
  );

  return {
    props: props,
    container: container,
  };
};

describe("FormEditorLayout.tsx", () => {
  describe("If the key loading is true.", () => {
    const loading = true;
    const jsonTypeToEdit = "input";

    test("It must render the loader.", () => {
      renderComponent({ loading: loading, jsonTypeToEdit: jsonTypeToEdit });

      const loader = screen.getByRole("heading", { name: /loading.../i });

      expect(loader).toBeInTheDocument();
    });
  });

  describe("If the key loading is false.", () => {
    const loading = false;
    const jsonTypeToEdit = "input";

    test("It must not render the loader.", () => {
      renderComponent({ loading: loading, jsonTypeToEdit: jsonTypeToEdit });

      const loader = screen.queryByRole("heading", { name: /loading.../i });

      expect(loader).not.toBeInTheDocument();
    });
  });

  describe("If the key jsonTypeToEdit is input", () => {
    const loading = false;
    const jsonTypeToEdit = "input";

    test("It must render the input editor.", () => {
      const { container } = renderComponent({
        loading: loading,
        jsonTypeToEdit: jsonTypeToEdit,
      });

      const inputEditor = container.querySelector(".input-editor");

      expect(inputEditor).toBeInTheDocument();
    });
  });

  describe("If the key jsonTypeToEdit is outputWithInput", () => {
    const loading = false;
    const jsonTypeToEdit = "outputWithInput";

    test("It must render the outputWithInput editor.", () => {
      const { container } = renderComponent({
        loading: loading,
        jsonTypeToEdit: jsonTypeToEdit,
      });

      const inputEditor = container.querySelector(".output-with-input-editor");

      expect(inputEditor).toBeInTheDocument();
    });
  });

  describe("General Tests.", () => {
    const loading = false;
    const jsonTypeToEdit = "outputWithInput";

    test("It must render the main.", () => {
      renderComponent({
        loading: loading,
        jsonTypeToEdit: jsonTypeToEdit,
      });

      const main = screen.getByRole("main");

      expect(main).toBeInTheDocument();
    });

    test("It must render the form and the submit button entered by props. Also when the button is clicked it must execute the pertinent functions.", async () => {
      const { props, container } = renderComponent({
        loading: loading,
        jsonTypeToEdit: jsonTypeToEdit,
      });

      const form = container.querySelector("form");
      const btnSubmit = screen.getByRole("button", { name: /submit form/i });

      expect(form).toBeInTheDocument();
      expect(btnSubmit).toBeInTheDocument();

      await user.click(btnSubmit);

      expect(props.mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    test("It must render the link to return to home.", () => {
      renderComponent({
        loading: loading,
        jsonTypeToEdit: jsonTypeToEdit,
      });

      const linkHome = screen.getByRole("link", { name: /go to home/i });

      expect(linkHome).toBeInTheDocument();
    });
  });
});
