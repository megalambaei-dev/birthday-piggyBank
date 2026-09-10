import { useEffect, useState } from 'react'
import BarraDoacoes from './components/progress-bar'
import FormularioDoacoes from './components/donation-form'
import React from 'react'

function App() {
  const [atual, setAtual] = useState(0)
  const meta = 100

  const URL = import.meta.env.VITE_SCRIPT_URL;

  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then((data) => setAtual(data.total));
  }, []);

  const handleDoacaoSubmit = (valorDoado: number) => {
    setAtual((prev) => prev + valorDoado)   
  }

  return (
    <div>
      <BarraDoacoes atual={atual} meta={meta} moeda="€" />
      <FormularioDoacoes onSubmit={handleDoacaoSubmit} />
    </div>
  )
}

export default App