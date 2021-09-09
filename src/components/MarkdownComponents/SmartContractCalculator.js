import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  MdVisibility,
  MdVisibilityOff,
  MdRotateLeft,
  MdClear,
} from 'react-icons/md'
import TextField from '@material-ui/core/TextField'

export default function SmartContractCalculator() {
  const [perByteCost, setPerByteCost] = useState(44)
  const [perStepCost, setPerStepCost] = useState(0.0000721)
  const [perMemUnitCost, setMemUnitCost] = useState(0.0577)
  const [perTransactionCost, setPerTransactionCost] = useState(155381)
  const [showParams, setShowParams] = useState(false)

  const [adaPrice, setAdaPrice] = useState()
  const [initialized, setInitialized] = useState(false)
  const [unableToGetPrice, setUnableToGetPrice] = useState(false)
  const [adaPriceScenario, setAdaPriceScenario] = useState(5)

  const [transactions, setTransactions] = useState([
    {
      txSize: 0,
      cpuSteps: 0,
      memUnits: 0,
    },
  ])

  useEffect(() => {
    const getAdaPrice = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/cardano'
        )
        const data = await res.json()
        const price = data?.market_data?.current_price?.usd
        setAdaPrice(price)
        setInitialized(true)
      } catch (e) {
        setUnableToGetPrice(true)
        setAdaPrice(2.4)
        setInitialized(true)
      }
    }

    if (!initialized) getAdaPrice()
  }, [initialized])

  const txPrice = (t) =>
    !t.txSize && !t.cpuSteps && !t.memUnits
      ? 0
      : (
          ((perByteCost || 0) * (t.txSize || 0) +
            (perStepCost || 0) * (t.cpuSteps || 0) +
            (perMemUnitCost || 0) * (t.memUnits || 0) +
            (perTransactionCost || 0)) /
          1000000
        ).toFixed(6)

  const dappFee = () => {
    let fee = 0
    for (const t of transactions) fee = fee + txPrice(t)
    return fee
  }

  return initialized ? (
    <>
      <Controls>
        <RoundedButton onClick={() => setShowParams(!showParams)}>
          {showParams ? 'Hide' : 'Show'} network parameters
          <span>{showParams ? <MdVisibilityOff /> : <MdVisibility />}</span>
        </RoundedButton>
        <RoundedButton
          onClick={() => {
            setPerByteCost(44)
            setPerStepCost(0.0000721)
            setMemUnitCost(0.0577)
            setPerTransactionCost(155381)
            setTransactions([
              {
                txSize: 0,
                cpuSteps: 0,
                memUnits: 0,
              },
            ])
          }}
        >
          Reset All{' '}
          <span>
            <MdRotateLeft />
          </span>
        </RoundedButton>
      </Controls>
      {showParams && (
        <Params>
          <div>
            <TextField
              label="Per Byte Cost"
              helperText="Per Byte Cost"
              value={perByteCost}
              type="number"
              min={0}
              onChange={(e) => setPerByteCost(parseInt(e.target.value))}
              onBlur={(e) => !e.target.value && setPerByteCost(0)}
            />
          </div>

          <div>
            <TextField
              label="Per Step Cost"
              helperText="Per Step Cost"
              type="number"
              min="0"
              value={perStepCost}
              onChange={(e) => setPerStepCost(parseInt(e.target.value))}
              onBlur={(e) => !e.target.value && setPerStepCost(0)}
            />
          </div>

          <div>
            <TextField
              label="Per Mem Unit Cost"
              helperText="Per Mem Unit Cost"
              type="number"
              min="0"
              value={perMemUnitCost}
              onChange={(e) => setMemUnitCost(parseInt(e.target.value))}
              onBlur={(e) => !e.target.value && setMemUnitCost(0)}
            />
          </div>

          <div>
            <TextField
              label="Per Transaction Cost"
              helperText="Per Transaction Cost"
              type="number"
              min="0"
              value={perTransactionCost}
              onChange={(e) => setPerTransactionCost(parseInt(e.target.value))}
              onBlur={(e) => !e.target.value && setPerTransactionCost(0)}
            />
          </div>
        </Params>
      )}
      <Transactions>
        {transactions.map((t, i) => (
          <Transaction>
            <Title>
              <span>Transaction {i + 1}</span>
              <button
                onClick={() => {
                  let txs = transactions
                  txs.splice(i, 1)
                  console.log(txs)
                  setTransactions([...txs])
                }}
              >
                <MdClear />
              </button>
            </Title>

            <Fields>
              <div>
                <TextField
                  label="Transaction Size"
                  helperText="Transaction Size"
                  type="number"
                  min="0"
                  value={t.txSize}
                  max="16384"
                  min="0"
                  onChange={(e) => {
                    let txs = transactions
                    const input = parseInt(e.target.value)

                    txs[i].txSize = input > 16384 ? 16384 : input
                    setTransactions([...txs])
                  }}
                  onBlur={(e) => {
                    if (e.target.value) return null
                    let txs = transactions
                    txs[i].txSize = 0
                    setTransactions([...txs])
                  }}
                />
              </div>

              <div>
                <TextField
                  label="CPU Steps"
                  helperText="CPU Steps"
                  type="number"
                  value={t.cpuSteps}
                  onChange={(e) => {
                    let txs = transactions
                    const input = parseInt(e.target.value)
                    txs[i].cpuSteps = input > 10000000000 ? 10000000000 : input

                    setTransactions([...txs])
                  }}
                  onBlur={(e) => {
                    if (e.target.value) return null
                    let txs = transactions
                    txs[i].cpuSteps = 0
                    setTransactions([...txs])
                  }}
                  min="0"
                  max="10000000000"
                />
              </div>

              <div>
                <TextField
                  label="Memory Units"
                  helperText="Memory Units"
                  type="number"
                  type="number"
                  value={t.memUnits}
                  onChange={(e) => {
                    let txs = transactions
                    const input = parseInt(e.target.value)
                    txs[i].memUnits = input > 10000000 ? 10000000 : input
                    setTransactions([...txs])
                  }}
                  onBlur={(e) => {
                    if (e.target.value) return null
                    let txs = transactions
                    txs[i].memUnits = 0
                    setTransactions([...txs])
                  }}
                  max="10000000"
                />
              </div>
            </Fields>
            <strong>Estimated Transaction Price (ADA): ₳{txPrice(t)}</strong>
          </Transaction>
        ))}
      </Transactions>
      <RoundedButton
        onClick={() =>
          setTransactions([
            ...transactions,
            {
              txSize: 0,
              cpuSteps: 0,
              memUnits: 0,
            },
          ])
        }
      >
        Add Transaction
      </RoundedButton>
      <h2>Total Estimated Dapp Fee</h2>
      {dappFee()} ADA <br />
      <br />${dappFee() * adaPrice} USD (1ADA = {adaPrice}{' '}
      {!unableToGetPrice && `Rate supplied by CoinGecko`})
      <br />
      If the price of ADA was $
      <input
        type="number"
        min="0"
        value={adaPriceScenario}
        onChange={(e) => setAdaPriceScenario(e.target.value)}
      />{' '}
      USD The Dapp fee would be ${dappFee() * adaPriceScenario}
      <br />
      <br />
    </>
  ) : (
    <div>Loading...</div>
  )
}

const Controls = styled.div`
  display: flex;
  padding: 30px 0;
`

const RoundedButton = styled.button`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  outline: 0;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  font-family: Chivo, sans-serif;
  font-weight: 400;
  line-height: 1.7;
  letter-spacing: 0.1rem;
  width: 100%;
  padding: 1rem 2rem;
  border-radius: 1.8rem;
  color: #0a38a6;
  border: 1px solid #0033ad;
  background-color: #fff;

  &:first-of-type {
    margin-right: 10px;
  }

  &:nth-of-type(2) {
    margin-left: 10px;
  }

  &:hover {
    background-color: rgba(0, 51, 173, 0.04);
  }

  span {
    display: flex;
    align-items: center;
    margin-left: 5px;
  }
`

const Params = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0 25px 0;

  > div {
    width: 50%;
    padding: 0 20px 20px 20px;
  }

  .MuiTextField-root {
    width: 100%;
  }
`

const Transactions = styled.div`
  font-size: 16px;
`

const Transaction = styled.div`
  border-top: 0.1rem solid rgba(29, 30, 33, 0.3);
  padding: 45px 20px;
`

const Fields = styled.div`
  display: flex;
  padding: 10px 0;
  justify-content: space-between;
  padding-top: 15px;
  margin: 5px 0 20px 0;
`

const Title = styled.div`
  display: flex;
  justify-content: space-between;

  span {
    font-weight: bold;
    font-size: 22px;
  }

  button {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    outline: 0;
    align-items: center;
    justify-content: center;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-radius: 40px;
    color: #0a38a6;
    border: 1px solid #0033ad;
    background-color: #fff;
    height: 30px;
    width: 30px;

    &:hover {
      background-color: rgba(0, 51, 173, 0.04);
    }
  }
`
