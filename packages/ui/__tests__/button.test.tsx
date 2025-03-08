import React from "react"
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../src/button";

describe("Button Component", () => {
  test("renders button with label", () => {
    render(<Button label="Click me" />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    
    const button = screen.getByText("Click me");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("displays loading state", () => {
    render(<Button label="Submit" loading />);
    
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders with disabled state", () => {
    render(<Button label="Disabled" disabled />);
    
    const button = screen.getByText("Disabled");
    expect(button).toBeDisabled();
  });

  test("applies the correct color styles", () => {
    const { container } = render(<Button label="Primary" color="primary" />);
    expect(container.firstChild).toHaveClass("bg-blue-500");
  });

  test("renders left and right icons", () => {
    render(<Button label="Icon Button" leftIcon="←" rightIcon="→" />);
    
    expect(screen.getByText("←")).toBeInTheDocument();
    expect(screen.getByText("→")).toBeInTheDocument();
  });
});
