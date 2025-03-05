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
  
  const parsedAmount = parseFloat(amount)
  if (isNaN(parsedAmount) || parsedAmount === 0 || !fromCurrency || !toCurrency) 
    return fallbackAmount

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
    convertedAmount: roundPrice(convertedAmount, 6), 
    totalAmount: roundPrice(totalAmount, 6),
    feeAmount: roundPrice(feeAmount, 2)
  }
}

export const roundPrice = (num: number | string, decimal: number) => 
  (Math.round(Number(num) * 10 ** decimal) / 10 ** decimal).toFixed(decimal)

export const formatNumber = (num: string, locale: string = "en-US") => {
  if (num === "") return ""
  const [rawIntegerPart, decimalPart] = num.split(".")
  const integerPart = new Intl.NumberFormat(locale).format(parseFloat((rawIntegerPart || "").replace(/,/g, "")) || 0)
  return decimalPart !== undefined ? `${integerPart}.${decimalPart}` : integerPart
}