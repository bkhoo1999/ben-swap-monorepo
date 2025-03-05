import { useState, useEffect } from "react"

interface NumberInputProps {
  prefix?: string
  suffix?: string
  locale?: string
  displayValue: string
  disabled?: boolean
  handleChange: (value: string) => void
  child?: React.ReactNode
}

const NumberInput = ({
  prefix,
  suffix,
  handleChange,
  displayValue,
  locale = "en-US",
  disabled,
  child,
}: NumberInputProps) => {
  const defaultValueState = displayValue || ""
  const [value, setValue] = useState(defaultValueState)

  const formatNumber = (num: string, locale: string = "en-US") => {
    if (num === "") return ""
    const [rawIntegerPart, decimalPart] = num.split(".")
    const integerPart = new Intl.NumberFormat(locale).format(parseFloat((rawIntegerPart || "").replace(/,/g, "")) || 0)
    return decimalPart !== undefined ? `${integerPart}.${decimalPart}` : integerPart
  }

  useEffect(() => {
    setValue(formatNumber(defaultValueState, locale))
  }, [defaultValueState, locale])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9.]/g, "")
    if (inputValue.startsWith(".")) {
      setValue("0.")
      handleChange("0.")
      return
    }

    const decimalCount = (inputValue.match(/\./g) || []).length
    if (decimalCount > 1) return
    
    setValue(formatNumber(inputValue))
    handleChange(inputValue || "")
  }

  return (
    <div className="relative min-h-[120px] space-y-2 px-4 py-3">
      {prefix && <span className="text-xs text-gray-400">{prefix}</span>}

      <div className="relative">
        {child && (
          <div className="absolute left-0 top-5 text-xs font-medium text-gray-400">
            {child}
          </div>
        )}

        <div className="h-full text-right w-full">
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder="0.00"
            inputMode="decimal"
            autoComplete="off"
            disabled={disabled}
            className={`w-full bg-transparent text-right placeholder:text-gray-500 text-3xl font-semibold outline-none 
              ${disabled ? "cursor-not-allowed" : ""}`}
          />

          {suffix && (
            <div className="mt-1 text-xs font-medium text-gray-400 flex justify-end">
              {suffix}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NumberInput
