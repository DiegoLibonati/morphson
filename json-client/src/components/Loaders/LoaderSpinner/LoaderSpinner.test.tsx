import { render } from "@testing-library/react";

import { LoaderSpinnerProps } from "@src/entities/props";

import { LoaderSpinner } from "@src/components/Loaders/LoaderSpinner/LoaderSpinner";

type RenderComponent = {
  props: LoaderSpinnerProps;
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

describe("LoaderSpinner.tsx", () => {
  describe("General Tests.", () => {
    test("It must render the root of the loader.", async () => {
      const { props, container } = renderComponent();

      const loaderRoot = container.querySelector("div") as HTMLDivElement;

      expect(loaderRoot).toBeInTheDocument();
      expect(loaderRoot).toHaveClass(props.className!);
    });

    test("It must render the spinner.", () => {
      const { container } = renderComponent();

      const spinner = container.querySelector(".loader") as HTMLDivElement;

      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass("loader");
    });
  });
});
