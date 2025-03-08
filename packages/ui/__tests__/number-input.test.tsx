import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import NumberInput from "../src/number-input"

describe("NumberInput Component", () => {
  let handleChangeMock: jest.Mock

  beforeEach(() => {
    handleChangeMock = jest.fn()
  })

  const setup = (props = {}) => {
    render(<NumberInput displayValue={""} handleChange={handleChangeMock} {...props} />)
    return screen.getByRole("textbox")
  }

  test("renders with initial display value", () => {
    render(<NumberInput displayValue={"1000"} handleChange={() => {}} />)
    expect(screen.getByRole("textbox")).toHaveValue("1,000")
  })

  test("updates value when user types", () => {
    const input = setup()
    const value = "500"
    fireEvent.change(input, { target: { value } })
    expect(handleChangeMock).toHaveBeenCalledWith(value)
  })

  test("allows decimal input", () => {
    const input = setup()
    const value = "10.5"
    fireEvent.change(input, { target: { value } })
    expect(handleChangeMock).toHaveBeenCalledWith(value)
  })

  test("prevents multiple decimal points", () => {
    const input = setup()
    fireEvent.change(input, { target: { value: "10..5" } })
    expect(handleChangeMock).not.toHaveBeenCalledWith("10.5")
  })

  test("shows prefix and suffix when provided", () => {
    render(<NumberInput displayValue={"1000"} prefix="$" suffix="USD" handleChange={() => {}} />)
    expect(screen.getByText("$")).toBeInTheDocument()
    expect(screen.getByText("USD")).toBeInTheDocument()
  })
})
