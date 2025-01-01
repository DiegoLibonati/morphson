import { screen, render } from "@testing-library/react";

import { InputFile } from "./InputFile";

type RenderComponent = {
  props: {
    id: string;
    label: string;
    buttonLabel: string;
    emptyLabel: string;
    name: string;
    value: string;
    accept: string;
    className: string;
    spanClassName: string;
    mockOnChange: jest.Mock;
  };
  container: HTMLElement;
};

interface RenderComponentProps {
  value: string;
}

beforeEach(() => {
  jest.clearAllMocks();
});

const renderComponent = ({ value }: RenderComponentProps): RenderComponent => {
  const props = {
    id: "asd",
    label: "label",
    buttonLabel: "buttonLabel",
    emptyLabel: value ? "" : "label empty",
    name: "asd",
    value: value,
    accept: "accept",
    className: "class",
    spanClassName: "spanclass",
    mockOnChange: jest.fn(),
  };

  const { container } = render(
    <InputFile
      id={props.id}
      label={props.label}
      buttonLabel={props.buttonLabel}
      emptyLabel={props.emptyLabel}
      name={props.name}
      value={props.value}
      accept={props.accept}
      className={props.className}
      spanClassName={props.spanClassName}
      onChange={props.mockOnChange}
    ></InputFile>
  );

  return {
    props: props,
    container: container,
  };
};

describe("if there is a value in the input file.", () => {
  const value = "file.json";

  test("It should render the information message with the value from the file.", () => {
    renderComponent({ value: value });

    const message = screen.getByText(value);

    expect(message).toBeInTheDocument();
  });
});

describe("if there is not a value in the input file.", () => {
  const value = "";

  test("It should render the information message with the emptyLabel from props.", () => {
    const { props } = renderComponent({ value: value });

    const message = screen.getByText(props.emptyLabel);

    expect(message).toBeInTheDocument();
  });
});

describe("General Tests.", () => {
  const value = "file.json";

  test("It must render the input with label.", () => {
    const { props, container } = renderComponent({ value: value });

    const input = container.querySelector("input") as HTMLInputElement;
    const label = screen.getByText(props.label);

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id", props.id);
    expect(input).toHaveAttribute("name", props.name);
    expect(input).toHaveAttribute("accept", props.accept);
    expect(input).toHaveAttribute("type", "file");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", props.id);
  });

  test("It must render the button to add files.", () => {
    const { props } = renderComponent({ value: value });

    const btnLabel = screen.getByRole("button", { name: props.buttonLabel });

    expect(btnLabel).toBeInTheDocument();
    expect(btnLabel).toHaveTextContent(props.buttonLabel);
  });

  test("It must render the information message with the entered class.", () => {
    const { props } = renderComponent({ value: value });

    const message = screen.getByText(value);

    expect(message).toBeInTheDocument();
    expect(message).toHaveClass(props.spanClassName);
  });

  test("It must render the element with the class entered by props.", () => {
    const { props, container } = renderComponent({ value: value });

    const root = container.querySelector(
      `.${props.className}`
    ) as HTMLDivElement;

    expect(root).toBeInTheDocument();
    expect(root).toHaveClass(props.className);
  });
});
