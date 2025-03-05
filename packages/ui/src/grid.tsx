type GridDirection = "row" | "column"

interface GridProps {
  children: React.ReactNode
  container?: boolean
  item?: boolean
  spacing?: number
  divider?: boolean
  direction?: GridDirection,
  span?: number
  size?: number
  className?: string
}

const gridGap: Record<number, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16",
  20: "gap-20",
  24: "gap-24",
  32: "gap-32",
  40: "gap-40",
  48: "gap-48",
  56: "gap-56",
  64: "gap-64",
};

const gridRows: Record<number, string> = {
  1: "grid-rows-1",
  2: "grid-rows-2",
  3: "grid-rows-3",
  4: "grid-rows-4",
  5: "grid-rows-5",
  6: "grid-rows-6",
  7: "grid-rows-7",
  8: "grid-rows-8",
  9: "grid-rows-9",
  10: "grid-rows-10",
  11: "grid-rows-11",
  12: "grid-rows-12",
}

const gridColumns: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
}

const rowWidths: Record<number, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
  5: "row-span-5",
  6: "row-span-6",
  7: "row-span-7",
  8: "row-span-8",
  9: "row-span-9",
  10: "row-span-10",
  11: "row-span-11",
  12: "row-span-12",
}


const colWidths: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
}

const Grid = ({
  children,
  container = false,
  item = false,
  spacing = 0,
  divider = false,
  direction = "row",
  size = 1,
  span = 1,
  className = "",
}: GridProps) => {
  const spacingClass = container ? gridGap?.[spacing] : ""

  const dividerClass = item && divider
    ? direction === "row"
      ? "border-r border-gray-600 pr-1"
      : "border-b border-gray-600 pb-1"
    : ""

  const gridSize = direction === "row" ? gridColumns?.[size] : gridRows?.[size]

  const containerClass = `grid ${gridSize} ${spacingClass} mb-2`
  const itemClass = direction === "row" ? colWidths?.[span] : rowWidths?.[span]

  return container ? (
    <div data-testid="grid-container" className={`${containerClass} ${className}`.trim()}>
      {children &&
        (Array.isArray(children)
          ? children.map((child) =>
              child && typeof child === "object"
                ? { ...child, props: { ...child.props, direction } }
                : child
            )
          : children)}
    </div>
  ) : (
    <div data-testid="grid-item" className={`${itemClass} ${dividerClass} ${className}`.trim()}>
      {children}
    </div>
  )
}

export default Grid
