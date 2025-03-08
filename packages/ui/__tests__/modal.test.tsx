import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import Modal from "../src/modal"

describe("Modal Component", () => {
  const onCloseMock = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renders modal when open", () => {
    render(
      <Modal open={true} label="Test Modal" onClose={onCloseMock}>
        <p>Modal Content</p>
      </Modal>
    )

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Test Modal")).toBeInTheDocument()
    expect(screen.getByText("Modal Content")).toBeInTheDocument()
  })

  test("does not render when closed", () => {
    render(
      <Modal open={false} label="Test Modal" onClose={onCloseMock}>
        <p>Modal Content</p>
      </Modal>
    )

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  test("closes when clicking close button", () => {
    render(
      <Modal open={true} label="Test Modal" onClose={onCloseMock}>
        <p>Modal Content</p>
      </Modal>
    )

    fireEvent.click(screen.getByText("Close"))
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  test("closes when clicking overlay (if dismissable)", () => {
    render(
      <Modal open={true} label="Test Modal" onClose={onCloseMock} dismissable>
        <p>Modal Content</p>
      </Modal>
    )

    fireEvent.click(screen.getByRole("dialog").parentElement!) // Click overlay
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  test("does not close when clicking inside modal", () => {
    render(
      <Modal open={true} label="Test Modal" onClose={onCloseMock}>
        <p>Modal Content</p>
      </Modal>
    )

    fireEvent.click(screen.getByRole("dialog")) // Clicking inside
    expect(onCloseMock).not.toHaveBeenCalled()
  })

  test("closes when Escape key is pressed", () => {
    render(
      <Modal open={true} label="Test Modal" onClose={onCloseMock}>
        <p>Modal Content</p>
      </Modal>
    )

    fireEvent.keyDown(document, { key: "Escape" })
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })
})
