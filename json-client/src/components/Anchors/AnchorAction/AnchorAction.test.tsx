import { screen, render } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import { AnchorAction } from "./AnchorAction";

type RenderComponent = {
  props: {
    to: string;
    ariaLabel: string;
    noMark: boolean;
    className: string;
  };
  container: HTMLElement;
};

interface RenderComponentProps {
  noMark: boolean;
}

const renderComponent = ({ noMark }: RenderComponentProps): RenderComponent => {
  const props = {
    to: "asd",
    ariaLabel: "asd2",
    noMark: noMark,
    className: "1234",
  };

  const { container } = render(
    <MemoryRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <AnchorAction
        to={props.to}
        ariaLabel={props.ariaLabel}
        noMark={props.noMark}
        className={props.className}
      >
        Cuack
      </AnchorAction>
    </MemoryRouter>
  );

  return {
    props: props,
    container: container,
  };
};

describe("AnchorAction.tsx", () => {
  describe("If noMark prop is true", () => {
    const noMark = true;

    test("It must not render the span.", () => {
      const { container } = renderComponent({ noMark: noMark });

      const spanNoMark = container.querySelector(
        ".span-nomark"
      ) as HTMLSpanElement;

      expect(spanNoMark).not.toBeInTheDocument();
    });
  });

  describe("If noMark prop is false", () => {
    const noMark = false;

    test("It must render the span.", () => {
      const { container } = renderComponent({ noMark: noMark });

      const spanNoMark = container.querySelector(
        ".span-nomark"
      ) as HTMLSpanElement;

      expect(spanNoMark).toBeInTheDocument();
    });
  });

  describe("General Tests.", () => {
    const noMark = false;

    test("It must render the link with the entered text.", () => {
      const { props } = renderComponent({ noMark: noMark });

      const link = screen.getByRole("link", { name: props.ariaLabel });

      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent("Cuack");
      expect(link).toHaveClass(props.className);
    });
  });
});
