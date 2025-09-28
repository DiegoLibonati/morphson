import { screen, render } from "@testing-library/react";

import { SelectOptionProps } from "@src/entities/props";

import { SelectOption } from "@src/components/Selects/SelectOption/SelectOption";

type RenderComponent = {
  props: SelectOptionProps;
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const props = {
    value: "2",
  };

  const { container } = render(
    <SelectOption value={props.value}>2</SelectOption>
  );

  return {
    props: props,
    container: container,
  };
};

describe("SelectOption.tsx", () => {
  describe("General Tests.", () => {
    test("It must render the option with the entered props.", () => {
      const { props } = renderComponent();

      const option = screen.getByRole("option") as HTMLOptionElement;

      expect(option).toBeInTheDocument();
      expect(option.selected).toBe(false);
      expect(option).toHaveAttribute("value", props.value);
      expect(option).toHaveTextContent("2");
    });
  });
});
