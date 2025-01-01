import { screen, render } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import { AnchorSecondary } from "./AnchorSecondary";

type RenderComponent = {
  props: {
    to: string;
    ariaLabel: string;
    className: string;
  };
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const props = {
    to: "asd",
    ariaLabel: "asd2",
    className: "12345",
  };

  const { container } = render(
    <MemoryRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <AnchorSecondary
        to={props.to}
        ariaLabel={props.ariaLabel}
        className={props.className}
      >
        Cuack
      </AnchorSecondary>
    </MemoryRouter>
  );

  return {
    props: props,
    container: container,
  };
};

test("It must render the link with the entered text.", () => {
  const { props } = renderComponent();

  const link = screen.getByRole("link", { name: props.ariaLabel });

  expect(link).toBeInTheDocument();
  expect(link).toHaveTextContent("Cuack");
  expect(link).toHaveClass(props.className);
});
