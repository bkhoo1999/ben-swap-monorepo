"use client"
import { useState, useEffect } from "react"
import { MdOutlineSwapVert, MdOutlineSwapHoriz } from "react-icons/md"

import { useApp } from "../context/app-context"
import { formatNumber, calculateSwap, roundPrice } from "../utils/calculate"
import { CurrencyPair } from "../api/currency/route"

import NumberInput from "@repo/ui/number-input"
import Dropdown, { Option } from "@repo/ui/dropdown"
import Button from "@repo/ui/button"
import Accordion from "@repo/ui/accordion"
import Grid from "@repo/ui/grid"
import Modal from "@repo/ui/modal"

const SwapComponent = () => {
  const { isLoading, notification, fetchCurrencyPairs, swapCurrency, closeNotification } = useApp()
  const [currencyPairs, setCurrencyPairs] = useState<CurrencyPair[]>([])

  const defaultState:SwapState = {
    sellingAmount: "",
    buyingAmount: "",
    sellingPair: currencyPairs?.[0],
    buyingPair: currencyPairs?.[1],
    isSelling: true,
  }

  const [swapState, setSwapState] = useState<SwapState>(defaultState)

  useEffect(() => {
    const fetchPrices = async () => {
      const data = await fetchCurrencyPairs()
      setCurrencyPairs(data)
      setSwapState(prev => ({
        ...prev,
        sellingPair: data[0],
        buyingPair: data[1],
      }))
    }
    fetchPrices()
  }, [fetchCurrencyPairs])
  
  const { sellingAmount, buyingAmount, sellingPair, buyingPair, isSelling } = swapState

  const updateSwapState = (updates: Partial<SwapState>) => {
    setSwapState((prevState) => ({
      ...prevState,
      ...updates,
    }))
  }

  useEffect(() => {
    if (!sellingPair || !buyingPair) return
  
    if (isSelling) {
      const { totalAmount } = calculateSwap(sellingPair, buyingPair, sellingAmount, 'SELL') 
      updateSwapState({ buyingAmount: totalAmount })
    } else {
      const { totalAmount } = calculateSwap(buyingPair, sellingPair, buyingAmount, 'BUY') 
      updateSwapState({ sellingAmount: totalAmount })
    }
  }, [sellingAmount, buyingAmount, sellingPair, buyingPair, isSelling])

  const reversePairs = () => {
    setSwapState((prev) => ({
      sellingPair: prev.buyingPair,
      buyingPair: prev.sellingPair,
      sellingAmount: prev.buyingAmount,
      buyingAmount: prev.sellingAmount,
      isSelling: !prev.isSelling,
    }))
  }

  const performSwap = () => {
    swapCurrency(
      sellingPair?.currency || "",
      buyingPair?.currency || "", 
      parseFloat(sellingAmount), 
      parseFloat(buyingAmount)
    )
      .then(() => 
        updateSwapState({ 
          sellingAmount: defaultState?.sellingAmount,
          buyingAmount: defaultState?.buyingAmount
        })
      )
  }

  const shouldDisableSwap = 
    currencyPairs?.length === 0 ||
    !sellingPair || 
    !buyingPair || 
    !sellingAmount || 
    !buyingAmount || 
    sellingPair?.currency === buyingPair?.currency

  const shouldDisableReverse = 
    !sellingPair || 
    !buyingPair || 
    sellingPair?.currency === buyingPair?.currency

  const options: Option[] = currencyPairs?.map((currency) => ({
    label: `${currency?.emoji} ${currency?.currency} (${currency?.symbol})`,
    value: currency,
  }))

  const renderNumberInput = (
    label: string,
    amount: string,
    pair: CurrencyPair | undefined,
    isSelling: boolean
  ) => (
    <NumberInput
      prefix={label}
      disabled={isLoading}
      displayValue={amount}
      suffix={`${pair?.symbol || ""} ${formatNumber(roundPrice(amount, 2))}`}
      handleChange={(value) => updateSwapState({ 
        [isSelling ? "sellingAmount" : "buyingAmount"]: value, 
        isSelling 
      })}
      child={
        <Dropdown
          handleChange={(value) => updateSwapState({ 
            [isSelling ? "sellingPair" : "buyingPair"]: value 
          })}
          label="Select Currency"
          loading={isLoading}
          disabled={currencyPairs?.length === 0}
          value={pair}
          size="sm"
          options={options}
          selectionLabel="Select Currency"
        />
      }
    />
  )

  return (
    <Accordion style="bordered" title="SWAP EXCHANGE" defaultOpen>
      <Grid container size={2} spacing={2} direction="column">
        <Grid item divider>{renderNumberInput("Selling", sellingAmount, sellingPair, true)}</Grid>
        <Grid item>{renderNumberInput("Buying", buyingAmount, buyingPair, false)}</Grid>
      </Grid>
      <Grid container size={2} spacing={2} direction="row">
        <Grid item>
          <Button 
            label="Swap" 
            disabled={shouldDisableReverse} 
            loading={isLoading} 
            fullWidth 
            color="secondary" 
            leftIcon={<MdOutlineSwapVert />} 
            onClick={reversePairs} 
          />
        </Grid>
        <Grid item>
          <Button 
            label="Exchange" 
            disabled={shouldDisableSwap} 
            loading={isLoading} 
            fullWidth 
            color="success" 
            rightIcon={<MdOutlineSwapHoriz />}  
            onClick={performSwap}
          />
        </Grid>
      </Grid>
      <Grid container size={2} spacing={4} direction="row">
        <Grid item>
          {sellingPair && buyingPair &&
            <h4 className="text-xs text-left pt-2">1 {sellingPair?.currency} ≈ {calculateSwap(sellingPair, buyingPair)?.totalAmount} {buyingPair?.currency}</h4>
          }
        </Grid>
        <Grid item>
          <h4 className="text-xs text-right pt-2">1% Fees</h4>
        </Grid>
      </Grid>
      <Modal label="Notification" open={notification?.isOpen} type={notification?.type} onClose={closeNotification}>
        <h2>{notification?.message}</h2>
      </Modal>
    </Accordion>
  )
}

interface SwapState {
  sellingAmount: string
  sellingPair: CurrencyPair | undefined
  buyingAmount: string
  buyingPair: CurrencyPair | undefined
  isSelling: boolean
}

export default SwapComponent
