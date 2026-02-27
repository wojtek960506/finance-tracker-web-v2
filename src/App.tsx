import { useTheme } from '@/context/theme-context'
import { Topbar } from './components/layout/topbar';


function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Topbar>
        <h1>Finance Tracker</h1>
        <button onClick={toggleTheme}>Toggle Theme</button>
      </Topbar>
      {theme}
    </div>
  )
}

export default App
