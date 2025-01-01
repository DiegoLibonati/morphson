import { render } from "@testing-library/react";

import { LoaderSpinner } from "./LoaderSpinner";

type RenderComponent = {
  props: { className: string };
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const props = {
    className: "pepe",
  };

  const { container } = render(
    <LoaderSpinner className={props.className}></LoaderSpinner>
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

test("It must render the spinner.", () => {
  const { container } = renderComponent();

  const spinner = container.querySelector(".loader") as HTMLDivElement;

  expect(spinner).toBeInTheDocument();
  expect(spinner).toHaveClass("loader");
});
