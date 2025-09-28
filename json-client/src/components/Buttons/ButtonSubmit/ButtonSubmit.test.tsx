import { screen, render } from "@testing-library/react";

import { ButtonSubmitProps } from "@src/entities/props";

import { ButtonSubmit } from "@src/components/Buttons/ButtonSubmit/ButtonSubmit";

type RenderComponent = {
  props: ButtonSubmitProps;
  container: HTMLElement;
};

interface RenderComponentProps {
  disabled: boolean;
}

const renderComponent = ({
  disabled,
}: RenderComponentProps): RenderComponent => {
  const props = {
    ariaLabel: "asd2",
    disabled: disabled,
    className: "12345",
  };

  const { container } = render(
    <ButtonSubmit
      className={props.className}
      ariaLabel={props.ariaLabel}
      disabled={disabled}
    >
      Cuack
    </ButtonSubmit>
  );

  return {
    props: props,
    container: container,
  };
};

describe("ButtonSubmit.tsx", () => {
  describe("If disabled key is true", () => {
    const disabled = true;

    test("It must render the button disabled", () => {
      const { props } = renderComponent({ disabled: disabled });

      const btnSubmit = screen.getByRole("button", { name: props.ariaLabel });

      expect(btnSubmit).toBeInTheDocument();
      expect(btnSubmit).toBeDisabled();
    });
  });

  describe("If disabled key is false", () => {
    const disabled = false;

    test("It must render the button disabled", () => {
      const { props } = renderComponent({ disabled: disabled });

      const btnSubmit = screen.getByRole("button", { name: props.ariaLabel });

      expect(btnSubmit).toBeInTheDocument();
      expect(btnSubmit).not.toBeDisabled();
    });
  });

  describe("General Tests.", () => {
    const disabled = false;

    test("It must render the button submit", () => {
      const { props } = renderComponent({ disabled: disabled });

      const btnSubmit = screen.getByRole("button", { name: props.ariaLabel });

      expect(btnSubmit).toBeInTheDocument();
      expect(btnSubmit).toHaveTextContent("Cuack");
      expect(btnSubmit).toHaveAttribute("type", "submit");
      expect(btnSubmit).toHaveClass(props.className!);
    });
  });
});
