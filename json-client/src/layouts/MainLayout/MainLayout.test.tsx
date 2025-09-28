import { screen, render } from "@testing-library/react";

import { MainLayoutProps } from "@src/entities/props";

import { MainLayout } from "@src/layouts/MainLayout/MainLayout";

type RenderComponent = {
  props: MainLayoutProps;
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

describe("MainLayout.tsx", () => {
  describe("General Tests.", () => {
    test("It must render the main.", () => {
      const { props } = renderComponent();

      const main = screen.getByRole("main");

      expect(main).toBeInTheDocument();
      expect(main).toHaveClass(props.className!);
    });

    test("It must render the element entered by child.", () => {
      renderComponent();

      const heading = screen.getByRole("heading", { name: /hi2/i });

      expect(heading).toBeInTheDocument();
    });
  });
});
