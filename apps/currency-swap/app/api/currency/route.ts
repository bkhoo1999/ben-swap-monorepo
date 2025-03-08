import { roundPrice } from "../../utils/calculate"

export interface CurrencyPair {
  currency: string
  value: number
  emoji: string
  symbol: string
  locale: string
}

export interface SwapResponse {
  message?: string
  error?: string
}

// Mock DB - hardcoded_currency_pairs
export const CURRENCY_PAIRS: CurrencyPair[] = [
  { currency: "USD", value: 1, emoji: "🇺🇸", symbol: "$", locale: "en-US" },
  { currency: "HKD", value: 7.798926, emoji: "🇭🇰", symbol: "HK$", locale: "zh-HK" },
  { currency: "AUD", value: 1.487089, emoji: "🇦🇺", symbol: "A$", locale: "en-AU" },
  { currency: "MYR", value: 4.375, emoji: "🇲🇾", symbol: "RM", locale: "ms-MY" },
  { currency: "GBP", value: 0.761538, emoji: "🇬🇧", symbol: "£", locale: "en-GB" },
  { currency: "EUR", value: 0.899038, emoji: "🇪🇺", symbol: "€", locale: "de-DE" },
  { currency: "IDR", value: 15538.905259, emoji: "🇮🇩", symbol: "Rp", locale: "id-ID" },
  { currency: "NZD", value: 1.625053, emoji: "🇳🇿", symbol: "NZ$", locale: "en-NZ" },
  { currency: "CNY", value: 7.1369, emoji: "🇨🇳", symbol: "¥", locale: "zh-CN" },
  { currency: "CZK", value: 22.549, emoji: "🇨🇿", symbol: "Kč", locale: "cs-CZ" },
  { currency: "AED", value: 3.672815, emoji: "🇦🇪", symbol: "د.إ", locale: "ar-AE" }
]

const simulateDBLoad = (delay = 2000) => new Promise(resolve => setTimeout(resolve, delay))

export const GET = async () => {
  await simulateDBLoad()
  return Response.json(CURRENCY_PAIRS)
}

export const POST = async (request: Request) => {
  try {
    const { from, to, fromAmount, toAmount } = await request.json()
    const fromCurrencyLocale = CURRENCY_PAIRS.find((pair) => pair.currency === from)?.locale;
    const toCurrencyLocale = CURRENCY_PAIRS.find((pair) => pair.currency === to)?.locale;

    if (!from || !to || isNaN(fromAmount) || isNaN(toAmount)) 
      return new Response(JSON.stringify({ error: "Invalid request data" }), { status: 400 })
    
    if (!fromCurrencyLocale || !toCurrencyLocale) 
      return new Response(JSON.stringify({ error: "Invalid currency pair" }), { status: 400 });

    const fromPrice = roundPrice(fromAmount.toString(), 2, fromCurrencyLocale)
    const toPrice = roundPrice(toAmount.toString(), 2, toCurrencyLocale)
    
    await simulateDBLoad()
    return Response.json({ 
      message: `Exchange Completed: ${fromPrice} ${from} -> ${toPrice} ${to}` 
    })
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON format" }), { status: 400 })
  }
}
