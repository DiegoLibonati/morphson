import { screen, render } from "@testing-library/react";
import user from "@testing-library/user-event";

import { SelectNormalProps } from "@src/entities/props";

import { SelectNormal } from "@src/components/Selects/SelectNormal/SelectNormal";

type RenderComponent = {
  props: { onChange: jest.Mock } & SelectNormalProps;
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const props = {
    id: "input",
    label: "pepiño",
    name: "input",
    value: "",
    className: "hi",
    onChange: jest.fn(),
  };

  const { container } = render(
    <SelectNormal
      id={props.id}
      label={props.label}
      name={props.name}
      value={props.value}
      className={props.className}
      onChange={props.onChange}
    >
      <option value="1">1</option>
    </SelectNormal>
  );

  return {
    props: props,
    container: container,
  };
};

describe("SelectNormal.tsx", () => {
  describe("General Tests.", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("It must render the select with label.", () => {
      const { props, container } = renderComponent();

      const select = container.querySelector<HTMLSelectElement>("select");
      const label = screen.getByText(props.label);

      expect(select).toBeInTheDocument();
      expect(select).toHaveClass(props.className!);
      expect(select).toHaveAttribute("id", props.id);
      expect(select).toHaveAttribute("name", props.name);
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("for", props.id);
    });

    test("It should render the child entered when the component was rendered.", () => {
      renderComponent();

      const option = screen.getByRole("option");

      expect(option).toBeInTheDocument();
      expect(option).toHaveAttribute("value", "1");
    });

    test("The corresponding functions must be executed when an option is selected.", async () => {
      const { props, container } = renderComponent();

      const select = container.querySelector<HTMLSelectElement>("select");

      await user.selectOptions(select!, "1");

      expect(props.onChange).toHaveBeenCalledTimes(1);
    });
  });
});
