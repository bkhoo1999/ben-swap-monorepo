"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from "react"
import { CurrencyPair, SwapResponse } from "../api/currency/route"
import { ModalType } from "@benswap/ui/modal"

interface NotificationState {
  isOpen: boolean
  type: ModalType
  message: string
}

interface AppContextType {
  isLoading: boolean
  notification: NotificationState
  setLoading: (state: boolean) => void
  showNotification: (type: ModalType, message: string) => void
  closeNotification: () => void
  fetchCurrencyPairs: () => Promise<CurrencyPair[]>
  swapCurrency: (from: string, to: string, fromAmount: number, toAmount: number) => Promise<SwapResponse>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    type: "default",
    message: "",
  })

  const showNotification = (type: ModalType, message: string) => {
    setNotification({ isOpen: true, type, message })
  }

  const closeNotification = () => {
    setNotification({ isOpen: false, type: "default", message: "" })
  }

  const fetchCurrencyPairs = useCallback((): Promise<CurrencyPair[]> => {
    setIsLoading(true)
    return fetch("/api/currency")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch currency pairs.")
        return response.json()
      })
      .catch((error) => {
        showNotification("error", error.message)
        return []
      })
      .finally(() => setIsLoading(false))
  }, [])

  const exchangeCurrency = useCallback((
    from: string, 
    to: string, 
    fromAmount: number, 
    toAmount: number
  ): Promise<SwapResponse> => {
    setIsLoading(true)
    return fetch("/api/currency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, fromAmount, toAmount }),
    })
      .then(async (response) => {
        const data: SwapResponse = await response.json()
        if (!response.ok) throw new Error(data.error || "Failed to complete exchange.")
        showNotification("success", data.message || "Exchange completed successfully!")
        return data
      })
      .catch((error) => {
        showNotification("error", error.message)
        return { error: error.message }
      })
      .finally(() => setIsLoading(false))
  }, [])
  

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setLoading: setIsLoading,
        notification,
        showNotification,
        closeNotification,
        fetchCurrencyPairs,
        swapCurrency: exchangeCurrency
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
