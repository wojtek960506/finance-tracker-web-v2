import { useTheme } from '@/context/theme-context'


function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="min-h-screen bg-bg text-text">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6 sm:p-10">
        <header className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
          <h1 className="text-2xl font-semibold">Finance Tracker</h1>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md border border-border bg-bg px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-surface dark:hover:bg-bg"
          >
            {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          </button>
        </header>

        <section className="rounded-xl border border-border bg-surface p-6">
          <p className="text-sm text-text-muted">Theme setup is ready with Tailwind tokens.</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="inline-flex rounded-md border border-border bg-bg px-3 py-1 text-sm">bg-bg</span>
            <span className="inline-flex rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
              bg-primary
            </span>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
