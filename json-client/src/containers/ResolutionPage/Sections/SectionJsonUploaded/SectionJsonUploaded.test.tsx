import { screen, render } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import { SectionJsonUploaded } from "./SectionJsonUploaded";

type RenderComponent = {
  props: {
    jsonName: string;
  };
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const props = {
    jsonName: "asd",
  };

  const { container } = render(
    <MemoryRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <SectionJsonUploaded jsonName={props.jsonName}></SectionJsonUploaded>
    </MemoryRouter>
  );

  return {
    props: props,
    container: container,
  };
};

test("It must render the json upload message and the link to home.", () => {
  const { props } = renderComponent();

  const message = screen.getByText(new RegExp(props.jsonName));
  const linkHome = screen.getByRole("link", { name: /go to home/i });

  expect(message).toBeInTheDocument();
  expect(linkHome).toBeInTheDocument();
});
