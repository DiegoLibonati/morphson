import { screen, render } from "@testing-library/react";

import { MainLayout } from "./MainLayout";

type RenderComponent = {
  props: {
    className: string;
  };
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const props = {
    className: "asd",
  };

  const { container } = render(
    <MainLayout className={props.className}>
      <h2>Hi2</h2>
    </MainLayout>
  );

  return {
    props: props,
    container: container,
  };
};

test("It must render the main.", () => {
  const { props } = renderComponent();

  const main = screen.getByRole("main");

  expect(main).toBeInTheDocument();
  expect(main).toHaveClass(props.className);
});

test("It must render the element entered by child.", () => {
  renderComponent();

  const heading = screen.getByRole("heading", { name: /hi2/i });

  expect(heading).toBeInTheDocument();
});
