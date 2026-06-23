import { Skeleton } from '../ui/Skeleton'

export function RouteLoadingFallback() {
  return (
    <div className="min-h-dvh bg-slate-50 px-6 py-10" role="status" aria-label="Loading page">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <Skeleton className="h-8 w-40" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full max-w-2xl" />
          <Skeleton className="h-5 w-full max-w-xl" />
          <Skeleton className="h-5 w-3/4 max-w-lg" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    </div>
  )
}
