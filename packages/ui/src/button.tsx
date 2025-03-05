import { ReactNode } from "react"
import { mergeClass, Size, Color } from "./utils/style"

interface ButtonProps {
  label: string
  size?: Size
  color?: Color
  leftIcon?: ReactNode | string
  rightIcon?: ReactNode | string
  disabled?: boolean
  loading?: boolean
  active?: boolean
  className?: string
  fullWidth?: boolean
  onClick?: () => void
}

const Button = ({
  label,
  size = "md",
  color = "primary",
  leftIcon,
  rightIcon,
  disabled = false,
  loading = false,
  active = false,
  className = "",
  fullWidth = false,
  onClick = () => {},
  ...props
}: ButtonProps) => {
  const baseStyles = "flex items-center justify-center rounded-md font-medium transition duration-200"
  const disabledStyles = disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  const activeStyles = active ? "ring-2 ring-blue-300" : ""
  const widthStyles = fullWidth ? "w-full" : ""

  const buttonSizeStyles = {
    sm: "px-3 py-1 text-sm min-w-[130px]",
    md: "px-4 py-2 text-base min-w-[150px]",
    lg: "px-6 py-3 text-lg min-w-[170px]",
  }
  
  const buttonColorStyles = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
  }
  
  return (
    <button
      className={mergeClass(baseStyles, buttonSizeStyles[size], buttonColorStyles[color], disabledStyles, activeStyles, widthStyles, className)}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="animate-spin h-3 w-3 mr-2 border-2 border-white border-t-transparent rounded-full" />
          Loading...
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-1 text-xl">{leftIcon}</span>}
          {label}
          {rightIcon && <span className="ml-1 text-xl">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}

export default Button
