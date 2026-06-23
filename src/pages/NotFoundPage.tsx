import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-wide text-tenant-primary">404</p>
      <h1 className="mt-3 text-4xl font-bold text-slate-950">Page not found</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded bg-tenant-primary px-5 py-3 font-semibold text-white"
      >
        Return home
      </Link>
    </>
  )
}

export default NotFoundPage
