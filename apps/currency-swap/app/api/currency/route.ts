import { roundPrice } from "../../utils/calculate"

export interface CurrencyPair {
  currency: string
  value: number
  emoji: string
  symbol: string
}

export interface SwapResponse {
  message?: string
  error?: string
}

export const CURRENCY_PAIRS: CurrencyPair[] = [
  { currency: "USD", value: 1, emoji: "🇺🇸", symbol: "$" },
  { currency: "HKD", value: 7.798926, emoji: "🇭🇰", symbol: "HK$" },
  { currency: "AUD", value: 1.487089, emoji: "🇦🇺", symbol: "A$" },
  { currency: "MYR", value: 4.375, emoji: "🇲🇾", symbol: "RM" },
  { currency: "GBP", value: 0.761538, emoji: "🇬🇧", symbol: "£" },
  { currency: "EUR", value: 0.899038, emoji: "🇪🇺", symbol: "€" },
  { currency: "IDR", value: 15538.905259, emoji: "🇮🇩", symbol: "Rp" },
  { currency: "NZD", value: 1.625053, emoji: "🇳🇿", symbol: "NZ$" },
  { currency: "CNY", value: 7.1369, emoji: "🇨🇳", symbol: "¥" },
  { currency: "CZK", value: 22.549, emoji: "🇨🇿", symbol: "Kč" },
  { currency: "AED", value: 3.672815, emoji: "🇦🇪", symbol: "د.إ" }
]

const simulateDBLoad = (delay = 2000) => new Promise(resolve => setTimeout(resolve, delay))

export const GET = async () => {
  await simulateDBLoad()
  return Response.json(CURRENCY_PAIRS)
}

export const POST = async (request: Request) => {
  try {
    const { from, to, fromAmount, toAmount } = await request.json()

    if (!from || !to || isNaN(fromAmount) || isNaN(toAmount)) {
      return new Response(JSON.stringify({ error: "Invalid request data" }), { status: 400 })
    }

    console.log(toAmount)

    await simulateDBLoad()
    return Response.json({ message: `Exchange Completed: ${roundPrice(fromAmount, 2)} ${from} -> ${roundPrice(toAmount, 2)} ${to}` })
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON format" }), { status: 400 })
  }
}
