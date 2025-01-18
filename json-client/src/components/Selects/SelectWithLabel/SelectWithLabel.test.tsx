import { screen, render } from "@testing-library/react";

import { SelectWithLabel } from "./SelectWithLabel";

type RenderComponent = {
  props: {
    id: string;
    label: string;
    className: string;
  };
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const props = {
    id: "select",
    label: "pepiño",
    className: "hi",
  };

  const { container } = render(
    <SelectWithLabel
      id={props.id}
      label={props.label}
      className={props.className}
    >
      <h2>Coquito</h2>
    </SelectWithLabel>
  );

  return {
    props: props,
    container: container,
  };
};

describe("SelectWithLabel.tsx", () => {
  describe("General Tests.", () => {
    test("It must render the label and the entered child when the component is rendered.", () => {
      const { props } = renderComponent();

      const label = screen.getByText(props.label);
      const heading = screen.getByRole("heading", { name: /coquito/i });

      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("for", props.id);
      expect(heading).toBeInTheDocument();
    });

    test("It must render the root of the component with the class entered by props.", () => {
      const { props, container } = renderComponent();

      const root = container.querySelector(
        `.${props.className}`
      ) as HTMLDivElement;

      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(props.className);
    });
  });
});
