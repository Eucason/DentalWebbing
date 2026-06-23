import { Link } from 'react-router-dom'
import { useTenantConfig } from '../../context/useTenant'
import { PageWrapper } from './PageWrapper'

export function Footer() {
  const config = useTenantConfig()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-slate-50 py-12 border-t border-slate-200">
      <PageWrapper className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-[var(--tenant-primary)]"
          >
            {config.logoUrl ? (
              <img src={config.logoUrl} alt={`${config.name} Logo`} className="h-8 w-auto" />
            ) : (
              <span>{config.name}</span>
            )}
          </Link>
          <p className="text-sm text-slate-600">Dedicated to providing excellent dental care.</p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-slate-900">Quick Links</h3>
          <Link
            to="/services"
            className="text-sm text-slate-600 hover:text-[var(--tenant-primary)] transition-colors"
          >
            Services
          </Link>
          <Link
            to="/team"
            className="text-sm text-slate-600 hover:text-[var(--tenant-primary)] transition-colors"
          >
            Our Team
          </Link>
          <Link
            to="/contact"
            className="text-sm text-slate-600 hover:text-[var(--tenant-primary)] transition-colors"
          >
            Contact Us
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-slate-900">Contact</h3>
          {config.address && <p className="text-sm text-slate-600">{config.address}</p>}
          {config.contactPhone && (
            <p className="text-sm text-slate-600">
              <a href={`tel:${config.contactPhone}`} className="hover:underline">
                {config.contactPhone}
              </a>
            </p>
          )}
          {config.contactEmail && (
            <p className="text-sm text-slate-600">
              <a href={`mailto:${config.contactEmail}`} className="hover:underline">
                {config.contactEmail}
              </a>
            </p>
          )}
        </div>
      </PageWrapper>

      <PageWrapper className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
        &copy; {year} {config.name}. All rights reserved.
      </PageWrapper>
    </footer>
  )
}
