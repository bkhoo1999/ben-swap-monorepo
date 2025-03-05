import { useState } from "react"
import { FaChevronDown } from "react-icons/fa"
import { mergeClass } from "./utils/style"

type AccordionStyle =  "default" | "filled" | "bordered"

interface AccordionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  style?: AccordionStyle
}

const Accordion = ({ title, children, defaultOpen = false, style = "default" }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const toggleAccordion = () => setIsOpen((prev) => !prev)

  const baseClass = "w-full max-w-sm sm:min-w-[500px] transition-all"
  const styles = {
    default: "border-b border-gray-300",
    filled: "bg-gray-700 text-white rounded-md p-2",
    bordered: "border border-gray-400 rounded-md",
  }

  return (
    <div className={mergeClass(baseClass, styles[style])}>
      <button
        className={mergeClass(
          "w-full flex justify-between items-center px-4 py-3 text-lg font-semibold focus:outline-none cursor-pointer",
          style === "bordered" && isOpen && "border-b"
        )}
        onClick={toggleAccordion}
      >
        {title}
        <FaChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-150 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="p-3">{children}</div>
      </div>
    </div>
  )
}

export default Accordion
