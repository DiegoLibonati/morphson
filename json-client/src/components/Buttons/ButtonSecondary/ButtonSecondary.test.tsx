import { screen, render } from "@testing-library/react";
import user from "@testing-library/user-event";

import { ButtonSecondaryProps } from "@src/entities/props";

import { ButtonSecondary } from "@src/components/Buttons/ButtonSecondary/ButtonSecondary";

type RenderComponent = {
  props: { onClick: jest.Mock } & ButtonSecondaryProps;
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const props = {
    ariaLabel: "asd2",
    className: "1234",
    onClick: jest.fn(),
  };

  const { container } = render(
    <ButtonSecondary
      ariaLabel={props.ariaLabel}
      className={props.className}
      onClick={props.onClick}
    >
      Cuack
    </ButtonSecondary>
  );

  return {
    props: props,
    container: container,
  };
};

describe("ButtonSecondary.tsx", () => {
  describe("General Tests.", () => {
    test("It must render the button with the entered text.", () => {
      const { props } = renderComponent();

      const btnSecondary = screen.getByRole("button", {
        name: props.ariaLabel,
      });

      expect(btnSecondary).toBeInTheDocument();
      expect(btnSecondary).toHaveTextContent("Cuack");
      expect(btnSecondary).toHaveClass(props.className!);
    });

    test("It should execute the relevant functions when clicked.", async () => {
      const { props } = renderComponent();

      const btnSecondary = screen.getByRole("button", {
        name: props.ariaLabel,
      });

      expect(btnSecondary).toBeInTheDocument();

      await user.click(btnSecondary);

      expect(props.onClick!).toHaveBeenCalledTimes(1);
    });
  });
});
