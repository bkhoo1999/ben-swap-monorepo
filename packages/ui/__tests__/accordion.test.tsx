import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import Accordion from "../src/accordion"

describe("Accordion Component", () => {
  test("renders with title", () => {
    render(<Accordion title="Test Accordion">Content goes here</Accordion>)
    
    expect(screen.getByText("Test Accordion")).toBeInTheDocument()
  })

  test("toggles content visibility when clicked", () => {
    render(<Accordion title="Toggle Me">Hidden Content</Accordion>)

    const button = screen.getByText("Toggle Me")
    const contentWrapper = button.parentElement?.querySelector("div:nth-child(2)")

    expect(contentWrapper).toHaveClass("max-h-0 opacity-0")

    fireEvent.click(button)
    expect(contentWrapper).toHaveClass("max-h-96 opacity-100")

    fireEvent.click(button)
    expect(contentWrapper).toHaveClass("max-h-0 opacity-0")
  })

  test("renders with defaultOpen as true", () => {
    render(<Accordion title="Always Open" defaultOpen>Visible Content</Accordion>)

    const button = screen.getByText("Always Open")
    const contentWrapper = button.parentElement?.querySelector("div:nth-child(2)")

    expect(contentWrapper).toHaveClass("max-h-96 opacity-100")
  })
})
