import { screen, render } from "@testing-library/react";
import user from "@testing-library/user-event";

import { InputCheck } from "./InputCheck";

type RenderComponent = {
  props: {
    id: string;
    label: string;
    name: string;
    value: string;
    mockOnChange: jest.Mock;
  };
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const props = {
    id: "input",
    label: "pepiño",
    name: "input",
    value: "input",
    mockOnChange: jest.fn(),
  };

  const { container } = render(
    <InputCheck
      id={props.id}
      label={props.label}
      name={props.name}
      value={props.value}
      onChange={props.mockOnChange}
    ></InputCheck>
  );

  return {
    props: props,
    container: container,
  };
};

test("It must render the input checkbox with label.", () => {
  const { props } = renderComponent();

  const input = screen.getByRole("checkbox", { name: props.label });
  const label = screen.getByText(props.label);

  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute("id", props.id);
  expect(input).toHaveAttribute("name", props.name);
  expect(input).toHaveAttribute("type", "checkbox");
  expect(input).not.toBeChecked();
  expect(label).toBeInTheDocument();
  expect(label).toHaveAttribute("for", props.id);
});

test("It must execute the onChange function when the input is clicked.", async () => {
  const { props } = renderComponent();

  const input = screen.getByRole("checkbox", { name: props.label });

  expect(input).toBeInTheDocument();

  await user.click(input);

  expect(props.mockOnChange).toHaveBeenCalledTimes(1);
});
