import { screen, render } from "@testing-library/react";
import user from "@testing-library/user-event";

import { InputField } from "./InputField";

type RenderComponent = {
  props: {
    id: string;
    label: string;
    name: string;
    placeholder: string;
    value: string;
    className: string;
    mockOnChange: jest.Mock;
  };
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const props = {
    id: "input",
    label: "pepiño",
    name: "input",
    placeholder: "Hi",
    value: "input",
    className: "hi",
    mockOnChange: jest.fn(),
  };

  const { container } = render(
    <InputField
      id={props.id}
      label={props.label}
      placeholder={props.placeholder}
      name={props.name}
      value={props.value}
      className={props.className}
      onChange={props.mockOnChange}
    ></InputField>
  );

  return {
    props: props,
    container: container,
  };
};

describe("InputField.tsx", () => {
  describe("General Tests.", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("It must render the input field with label.", () => {
      const { props } = renderComponent();

      const input = screen.getByRole("textbox", { name: props.label });
      const label = screen.getByText(props.label);

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("id", props.id);
      expect(input).toHaveAttribute("name", props.name);
      expect(input).toHaveAttribute("placeholder", props.placeholder);
      expect(input).toHaveAttribute("type", "text");
      expect(input).toHaveValue(props.value);
      expect(input).toHaveClass(props.className);
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("for", props.id);
    });

    test("It must execute the onChange function when writing to the input.", async () => {
      const value = "a";

      const { props } = renderComponent();

      const input = screen.getByRole("textbox", { name: props.label });

      expect(input).toBeInTheDocument();

      await user.click(input);
      await user.keyboard(value);

      expect(props.mockOnChange).toHaveBeenCalledTimes(1);
    });
  });
});
