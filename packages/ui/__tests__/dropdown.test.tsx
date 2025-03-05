import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import Dropdown, { Option } from "../src/dropdown"

describe("Dropdown Component", () => {
  const mockOptions: Option[] = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ]

  const mockHandleChange = jest.fn()

  test("renders with initial label", () => {
    render(
      <Dropdown
        label="Select an option"
        selectionLabel="Choose an option"
        options={mockOptions}
        value={null}
        handleChange={mockHandleChange}
      />
    )

    expect(screen.getByRole("button", { name: "Select an option" })).toBeInTheDocument()
  })

  test("opens modal when clicked", () => {
    render(
      <Dropdown
        label="Select an option"
        selectionLabel="Choose an option"
        options={mockOptions}
        value={null}
        handleChange={mockHandleChange}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Select an option" }))

    expect(screen.getByText("Choose an option")).toBeInTheDocument()
    expect(screen.getByText("Option 1")).toBeInTheDocument()
    expect(screen.getByText("Option 2")).toBeInTheDocument()
  })

  test("selects an option and closes the modal", async () => {
    render(
      <Dropdown
        label="Select an option"
        selectionLabel="Choose an option"
        options={mockOptions}
        value=""
        handleChange={mockHandleChange}
      />
    )
  
    fireEvent.click(screen.getByRole("button", { name: "Select an option" }))
    fireEvent.click(screen.getByRole("button", { name: "Option 2" }))
  
    expect(mockHandleChange).toHaveBeenCalledWith("option2")
  
    console.log(screen.queryByRole("dialog"))
  
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
  })

  test("disables the selected option", () => {
    render(
      <Dropdown
        label="Select an option"
        selectionLabel="Choose an option"
        options={mockOptions}
        value="option1"
        handleChange={mockHandleChange}
      />
    )
  
    fireEvent.click(screen.getByRole("button", { name: "Option 1" }))
  
    const selectedOption = screen.getAllByText("Option 1").find((el) => el.hasAttribute("disabled")) as HTMLElement
    expect(selectedOption).toHaveClass("cursor-not-allowed")
    expect(selectedOption).toBeDisabled()
  })
})
