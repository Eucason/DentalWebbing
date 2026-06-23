import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-950">
      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <Outlet />
      </main>
    </div>
  )
}
