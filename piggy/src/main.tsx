import { createRoot } from 'react-dom/client'
import BarraDoacoes from './components/progress-bar'
import FormularioDoacoes from './components/donation-form'

createRoot(document.getElementById('app')!).render(
  <div>
    <BarraDoacoes atual={3200} meta={10000} moeda="€" />
    <FormularioDoacoes /> 
  </div>
)