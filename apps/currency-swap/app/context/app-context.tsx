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
    const fallbackErrorMessage = "Failed to fetch currency pairs."
    return fetch("/api/currency")
      .then(async (response) => {
        if (!response.ok) {
          showNotification("error", fallbackErrorMessage)
          return []
        }
        return await response.json()
      })
      .catch((error) => {
        showNotification("error", error.message || fallbackErrorMessage)
        return []
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const exchangeCurrency = useCallback(
    async (from: string, to: string, fromAmount: number, toAmount: number): Promise<SwapResponse> => {
      setIsLoading(true)
      const fallbackErrorMessage = "Failed to complete Exchange."
      return fetch("/api/currency", {
        method: "POST",
        body: JSON.stringify({ from, to, fromAmount, toAmount }),
        headers: { "Content-Type": "application/json" }
      })
        .then(async (response) => {
          const data: SwapResponse = await response.json()
          if (!response.ok) {
            showNotification("error", data.error || fallbackErrorMessage)
          } else {
            showNotification("success", data.message || "Exchange completed successfully!")
          }
          return data
        })
        .catch((error) => {
          showNotification("error", error.message || fallbackErrorMessage)
          return { error: error.message || fallbackErrorMessage }
        })
        .finally(() => {
          setIsLoading(false)
        })
    }, []
  )

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
