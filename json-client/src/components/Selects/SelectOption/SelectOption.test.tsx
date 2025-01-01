import { screen, render } from "@testing-library/react";

import { SelectOption } from "./SelectOption";

type RenderComponent = {
  props: {
    value: string;
    selected: boolean;
  };
  container: HTMLElement;
};

interface RenderComponentProps {
  selected: boolean;
}

const renderComponent = ({
  selected,
}: RenderComponentProps): RenderComponent => {
  const props = {
    value: "2",
    selected: selected,
  };

  const { container } = render(
    <SelectOption value={props.value} selected={props.selected}>
      2
    </SelectOption>
  );

  return {
    props: props,
    container: container,
  };
};

describe("If key selected is true.", () => {
  const selected = true;

  test("It must render the selected option.", () => {
    renderComponent({ selected: selected });

    const option = screen.getByRole("option") as HTMLOptionElement;

    expect(option).toBeInTheDocument();
    expect(option.selected).toBe(selected);
  });
});

describe("If key selected is false.", () => {
  const selected = false;

  test("IT must render the unselected option.", () => {
    renderComponent({ selected: selected });

    const option = screen.getByRole("option") as HTMLOptionElement;

    expect(option).toBeInTheDocument();
    expect(option.selected).toBe(selected);
  });
});

describe("General Tests.", () => {
  test("It must render the option with the entered props.", () => {
    const { props } = renderComponent({ selected: false });

    const option = screen.getByRole("option") as HTMLOptionElement;

    expect(option).toBeInTheDocument();
    expect(option.selected).toBe(false);
    expect(option).toHaveAttribute("value", props.value);
    expect(option).toHaveTextContent("2");
  });
});
