"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from "react"
import { CurrencyPair, SwapResponse } from "../api/currency/route"
import { ModalType } from "@repo/ui/modal"


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

  const fetchCurrencyPairs = useCallback(async (): Promise<CurrencyPair[]> => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/currency")
      if (!response.ok) throw new Error("Failed to fetch currency pairs.")
      return await response.json()
    } catch {
      showNotification("error", "Failed to fetch currency pairs.")
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const exchangeCurrency = useCallback(
    async (from: string, to: string, fromAmount: number, toAmount: number): Promise<SwapResponse> => {
      setIsLoading(true)
      const fallbackErrorMessage = "Failed to complete Exchange."
      try {
        const response = await fetch("/api/currency", {
          method: "POST",
          body: JSON.stringify({ from, to, fromAmount, toAmount }),
        })
  
        const data: SwapResponse = await response.json()
  
        if (!response.ok) {
          showNotification("error", data.error || fallbackErrorMessage)
          return { error: data.error || fallbackErrorMessage }
        }
  
        showNotification("success", data.message || "Exchange completed successfully!")
        return { message: data.message }
      } catch {
        showNotification("error", fallbackErrorMessage )
        return { error: fallbackErrorMessage }
      } finally {
        setIsLoading(false)
      }
    }, 
    []
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
