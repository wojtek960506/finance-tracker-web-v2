import { useState } from 'react';
import { Drawer } from './components/ui';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/theme-context'
import { Topbar } from './components/layout/topbar';


function App() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Topbar>
        <button onClick={() => setIsOpen(true)} className="p-4 cursor-pointer">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text">Finance Tracker</h1>
        <button onClick={toggleTheme} className="p-4 cursor-pointer">
          {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </Topbar>

      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ul className="space-y-2">
          <li>Transactions</li>
          <li>Vehicles</li>
          <li>Sports</li>
          <li>Settings</li>
          <li>Logout</li>
        </ul>
      </Drawer>

      {theme}
    </div>
  )
}

export default App
