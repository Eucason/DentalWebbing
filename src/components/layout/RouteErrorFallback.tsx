import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

function getErrorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return error.statusText || `Request failed with status ${error.status}`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'The page could not be loaded.'
}

export function RouteErrorFallback() {
  const error = useRouteError()
  const message = getErrorMessage(error)

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-tenant-primary">
        Route error
      </p>
      <h1 className="mt-3 text-4xl font-bold text-slate-950">Something went wrong</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        This page failed to load. Please try again or return home.
      </p>
      {import.meta.env.VITE_APP_ENV === 'development' && (
        <pre className="mt-6 max-w-full overflow-auto rounded border border-slate-200 bg-white p-4 text-sm text-red-600">
          {message}
        </pre>
      )}
      <Link
        to="/"
        className="mt-8 inline-flex w-fit rounded bg-tenant-primary px-5 py-3 font-semibold text-white"
      >
        Return home
      </Link>
    </main>
  )
}
