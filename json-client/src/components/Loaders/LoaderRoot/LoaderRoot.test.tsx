import { screen, render } from "@testing-library/react";

import { LoaderRoot } from "./LoaderRoot";

type RenderComponent = {
  props: { className: string };
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const props = {
    className: "pepe",
  };

  const { container } = render(
    <LoaderRoot className={props.className}>
      <h2>Loading...</h2>
    </LoaderRoot>
  );

  return {
    props: props,
    container: container,
  };
};

test("It must render the root of the loader.", async () => {
  const { props, container } = renderComponent();

  const loaderRoot = container.querySelector("div") as HTMLDivElement;

  expect(loaderRoot).toBeInTheDocument();
  expect(loaderRoot).toHaveClass(props.className);
});

test("It must render the contents of the root loader.", () => {
  renderComponent();

  const heading = screen.getByRole("heading", { name: /loading.../i });

  expect(heading).toBeInTheDocument();
});
