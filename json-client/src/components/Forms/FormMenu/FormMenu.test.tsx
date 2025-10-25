import { screen, render } from "@testing-library/react";
import user from "@testing-library/user-event";

import { FormMenuProps } from "@src/entities/props";

import { FormMenu } from "@src/components/Forms/FormMenu/FormMenu";

type RenderComponent = {
  props: { onSubmit: jest.Mock } & FormMenuProps;
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const props = {
    className: "asd",
    onSubmit: jest.fn((e) => e.preventDefault()),
  };

  const { container } = render(
    <FormMenu className={props.className} onSubmit={props.onSubmit}>
      <button type="submit" aria-label="submit form"></button>
    </FormMenu>
  );

  return {
    props: props,
    container: container,
  };
};

describe("FormMenu.tsx", () => {
  describe("General Tests.", () => {
    test("It must render the form.", () => {
      const { props, container } = renderComponent();

      const form = container.querySelector<HTMLFormElement>(
        `.${props.className}`
      );

      expect(form).toBeInTheDocument();
      expect(form).toHaveClass(props.className!);
    });

    test("It must execute the submit of the form when the submit button is clicked.", async () => {
      const { props } = renderComponent();

      const btnSubmit = screen.getByRole("button", { name: /submit form/i });

      expect(btnSubmit).toBeInTheDocument();

      await user.click(btnSubmit);

      expect(props.onSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
