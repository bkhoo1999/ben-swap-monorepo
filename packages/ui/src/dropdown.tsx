import { useState, Fragment } from "react"
import Button from "./button"
import Modal from "./modal"
import { Color, Size } from "./utils/style"

interface DropdownProps {
  label: string
  selectionLabel: string
  loading?: boolean
  options: Option[]
  value: any
  handleChange: (value: any) => void
  size?: Size
  color?: Color
  disabled?: boolean
}

const Dropdown = ({
  label,
  options,
  loading,
  disabled,
  size = "md",
  color = "primary",
  handleChange,
  selectionLabel,
  value,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDirty, setIsDirty] = useState(Boolean(value))

  const toggleModal = () => setIsOpen((prev) => !prev)
  const handleClose = () => {
    setIsOpen(false)
    setIsDirty(Boolean(value))
  }

  const handleSelect = (optionValue: any) => {
    handleChange(optionValue)
    handleClose()
  }

  const isSelected = (option: Option) =>
    JSON.stringify(option.value) === JSON.stringify(value)

  const getLabel = () => {
    if (!value) return label
    return options.find(isSelected)?.label || label
  }

  return (
    <Fragment>
      <Button active={isOpen} disabled={disabled} loading={loading} label={getLabel()} onClick={toggleModal} color={color} size={size} />
      <Modal open={isOpen} label={selectionLabel} dismissable={!isDirty} onClose={handleClose}>
        {options.map((option, index) => {
          const selected = isSelected(option)
          return (
            <button
              key={index}
              className={`block w-full text-left px-4 py-2 
                ${selected ? "bg-blue-300 cursor-not-allowed" : 
                 option.disabled ? "opacity-50 cursor-not-allowed" : 
                 "hover:bg-gray-100 text-black cursor-pointer"}
              `}
              onClick={() => handleSelect(option.value)}
              disabled={selected || option.disabled}
            >
              {option.label}
            </button>
          )
        })}
      </Modal>
    </Fragment>
  )
}

export interface Option {
  value: any
  label: string
  disabled?: boolean
}

export default Dropdown
