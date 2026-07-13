import { Link } from 'react-router-dom'
import { useTenantConfig } from '../../context/useTenant'
import { getFooterNavigation } from '../../utils/navigation'
import { PageWrapper } from './PageWrapper'

export function Footer() {
  const config = useTenantConfig()
  const footerNavItems = getFooterNavigation(config)
  const year = new Date().getFullYear()

  const linkClass =
    'rounded text-sm text-slate-600 transition-colors hover:text-[var(--tenant-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]'

  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12">
      <PageWrapper className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex flex-col gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 rounded text-xl font-bold text-[var(--tenant-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]"
          >
            {config.logoUrl ? (
              <img src={config.logoUrl} alt={`${config.name} logo`} className="h-8 w-auto" />
            ) : (
              <span>{config.name}</span>
            )}
          </Link>
          <p className="text-sm text-slate-600">Dedicated to providing excellent dental care.</p>
        </div>

        {footerNavItems.length > 0 && (
          <nav className="flex flex-col gap-3" aria-label="Footer">
            <h2 className="font-semibold text-slate-900">Quick Links</h2>
            {footerNavItems.map((item) => (
              <Link key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <address className="not-italic">
          <h2 className="font-semibold text-slate-900">Contact</h2>
          {config.address && <p className="text-sm text-slate-600 not-italic">{config.address}</p>}
          {config.contactPhone && (
            <p className="text-sm text-slate-600 not-italic">
              <a
                href={`tel:${config.contactPhone}`}
                className="rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]"
              >
                {config.contactPhone}
              </a>
            </p>
          )}
          {config.contactEmail && (
            <p className="text-sm text-slate-600 not-italic">
              <a
                href={`mailto:${config.contactEmail}`}
                className="rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]"
              >
                {config.contactEmail}
              </a>
            </p>
          )}
        </address>
      </PageWrapper>

      <PageWrapper className="mt-12 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
        &copy; {year} {config.name}. All rights reserved.
      </PageWrapper>
    </footer>
  )
}
