import { BottomNav } from './BottomNav'
import { Header } from './Header'

interface PageShellProps {
  title: string
  subtitle?: string
  showSearch?: boolean
  children: React.ReactNode
}

export function PageShell({ title, subtitle, showSearch, children }: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title={title} subtitle={subtitle} showSearch={showSearch} />
      <main className="flex-1 bottom-safe overflow-y-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
