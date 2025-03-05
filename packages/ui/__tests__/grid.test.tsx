import { render, screen } from "@testing-library/react"
import Grid from "../src/grid"

describe("Grid Component", () => {
  test("renders the container with the correct grid size", () => {
    render(
      <Grid container size={3} spacing={4} className="custom-class">
        <div>Child 1</div>
        <div>Child 2</div>
      </Grid>
    )

    const gridContainer = screen.getByTestId("grid-container")
    expect(gridContainer).toHaveClass("grid grid-cols-3 gap-4 mb-2 custom-class")
  })

  test("renders an item with the correct span", () => {
    render(
      <Grid item span={2} className="custom-item">
        Item Content
      </Grid>
    )

    const gridItem = screen.getByTestId("grid-item")
    expect(gridItem).toHaveClass("col-span-2 custom-item")
  })

  test("applies a divider when set", () => {
    render(
      <Grid item divider direction="row">
        Divider Content
      </Grid>
    )

    const gridItem = screen.getByTestId("grid-item")
    expect(gridItem).toHaveClass("border-r border-gray-600 pr-1")
  })
})
