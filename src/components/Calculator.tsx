'use client'

import { useId, useState } from 'react'

// Calculadora de "venda boa bloqueada". Substitua a lógica pela mesma da home de iddnexis.com.br
// se ela usar uma fórmula diferente, para os números baterem nos dois lugares.

const brl = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0,
  )

export const Calculator = () => {
  const id = useId()
  const [orders, setOrders] = useState(10000)
  const [ticket, setTicket] = useState(250)
  const [declineRate, setDeclineRate] = useState(5)
  const [goodShare, setGoodShare] = useState(50)

  const declined = orders * (declineRate / 100)
  const goodDeclined = declined * (goodShare / 100)
  const lostMonth = goodDeclined * ticket

  const field = (
    label: string,
    value: number,
    set: (n: number) => void,
    suffix: string,
    help: string,
    step = 1,
  ) => (
    <label className="calc-field" htmlFor={`${id}-${label}`}>
      <span>{label}</span>
      <span className="calc-input">
        <input
          id={`${id}-${label}`}
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={value}
          onChange={(e) => set(Number(e.target.value))}
        />
        <span className="muted">{suffix}</span>
      </span>
      <span className="small muted">{help}</span>
    </label>
  )

  return (
    <div className="calculator">
      <div className="calc-fields">
        {field('Pedidos com cartão por mês', orders, setOrders, 'pedidos', 'Total de tentativas de compra com cartão.')}
        {field('Ticket médio', ticket, setTicket, 'R$', 'Valor médio de um pedido.')}
        {field('Recusa pelo antifraude', declineRate, setDeclineRate, '%', 'Parte dos pedidos que o antifraude reprova.', 0.1)}
        {field(
          'Dessas recusas, quantas eram compras legítimas',
          goodShare,
          setGoodShare,
          '%',
          'Sua estimativa de falso positivo. O Modo Sombra mede esse número com os seus dados.',
        )}
      </div>
      <p className="small muted calc-note">Os valores iniciais são só um exemplo. Troque pelos números da sua loja.</p>
      <div className="calc-result" aria-live="polite">
        <p className="small muted">Venda boa bloqueada por mês</p>
        <p className="calc-total">{brl(lostMonth)}</p>
        <p className="small muted">
          {Math.round(goodDeclined).toLocaleString('pt-BR')} pedidos legítimos recusados por mês · {brl(lostMonth * 12)} por
          ano
        </p>
      </div>
    </div>
  )
}
