import React, { useEffect, useCallback } from "react"

export type ModalType =   "success" | "error" | "default"

interface ModalProps {
  label: string
  open: boolean
  type?: ModalType
  dismissable?: boolean
  onClose: () => void
  children: React.ReactNode
}

const Modal = ({
  open,
  children,
  label,
  onClose,
  type = "default",
  dismissable = true
}: ModalProps) => {
  const handleOverlayClick = () => {
    if (dismissable) onClose()
  }

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && dismissable) onClose()
    },
    [onClose, dismissable]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
    } else {
      document.removeEventListener("keydown", handleKeyDown)
    }
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, handleKeyDown])

  const getModalStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 border-green-500 text-white-700"
      case "error":
        return "bg-red-500 border-red-500 text-white-700"
      default:
        return "bg-white border-gray-300 text-black"
    }
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.6)] z-50 transition-opacity duration-300 
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
      onClick={handleOverlayClick}
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`rounded-lg shadow-lg max-w-md w-full p-4 transform transition-all motion-safe:duration-300 
          border ${getModalStyles()} ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-medium mb-2">{label}</h2>
        {children}
        <button
          className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded cursor-pointer"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default Modal
