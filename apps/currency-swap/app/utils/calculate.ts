import { CurrencyPair } from "../api/currency/route"

export type PurchaseType = "SELL" | "BUY"
const feeRate = 0.01 // 1% fee

export const calculateSwap = ( 
  fromCurrency: CurrencyPair, 
  toCurrency: CurrencyPair,
  amount: string = "1",
  purchaseType: PurchaseType = "SELL",
) => {
  const fallbackAmount = { convertedAmount: "", totalAmount: "", feeAmount: "" }
  if (!fromCurrency || !toCurrency) return fallbackAmount

  const parsedAmount = getNormalizedValue(amount, fromCurrency?.locale)

  if (isNaN(parsedAmount) || parsedAmount === 0) return fallbackAmount

  const usdAmount = parsedAmount / fromCurrency.value
  const convertedAmount = usdAmount * toCurrency.value

  let totalAmount
  if (purchaseType === "BUY") {
    totalAmount = convertedAmount / (1 - feeRate) 
  } else {
    totalAmount = convertedAmount * (1 - feeRate) 
  }

  const feeAmount = convertedAmount - totalAmount

  return { 
    convertedAmount: roundPrice(convertedAmount.toString(), 6, toCurrency?.locale), 
    totalAmount: roundPrice(totalAmount.toString(), 6, toCurrency?.locale),
    feeAmount: roundPrice(feeAmount.toString(), 2, toCurrency?.locale), 
  }
}

export const roundPrice = (num: string, decimal: number, locale: string = "en-US") => {
  const { decimalSeparator } = getLocaleSeparators(locale)
  const parsedNum = getNormalizedValue(num, locale)
  if (isNaN(parsedNum)) return "0"

  const roundedValue = (Math.round(parsedNum * 10 ** decimal) / 10 ** decimal).toFixed(decimal)
  return roundedValue.replace(".", decimalSeparator)
}

export const formatNumber = (num: string, locale: string = "en-US") => {
  if (num === "") return ""
  const { decimalSeparator, thousandSeparator } = getLocaleSeparators(locale)
  const [rawIntegerPart, decimalPart] = num.replace(new RegExp(`\\${thousandSeparator}`, "g"), "").split(decimalSeparator)
  const integerPart = new Intl.NumberFormat(locale).format(parseFloat(rawIntegerPart || "0"))
  return decimalPart !== undefined ? `${integerPart}${decimalSeparator}${decimalPart}` : integerPart
}

const getLocaleSeparators = (locale: string = "en-US") => {
  const formattedNumber = new Intl.NumberFormat(locale).format(1.1)
  const decimalSeparator = formattedNumber.includes(",") ? "," : "."
  const thousandSeparator = decimalSeparator === "." ? "," : "."
  return { decimalSeparator, thousandSeparator }
}

export const getNormalizedValue = (num: string, locale: string = "en-US") => {
  const { decimalSeparator } = getLocaleSeparators(locale)
  const normalizedNum = num.replace(decimalSeparator, ".")
  return parseFloat(normalizedNum)
}