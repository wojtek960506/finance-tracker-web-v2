import './index.css'
import App from './App.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

type Theme = 'light' | 'dark'

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const initialTheme = getInitialTheme()
document.documentElement.classList.toggle('dark', initialTheme === 'dark')


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
