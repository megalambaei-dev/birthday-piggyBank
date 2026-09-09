import { createRoot } from 'react-dom/client'
import BarraDoacoes from './components/progress-bar'

createRoot(document.getElementById('app')!).render(
  <BarraDoacoes atual={3200} meta={10000} moeda="€" />
)