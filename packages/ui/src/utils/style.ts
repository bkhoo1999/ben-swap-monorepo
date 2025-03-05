export type Size = "sm" | "md" | "lg"
export type Color = "primary" | "secondary" | "danger" | "success"

export const mergeClass = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}