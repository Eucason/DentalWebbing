import { Link } from 'react-router-dom'
import { useTenantConfig } from '../../context/useTenant'
import { PageWrapper } from './PageWrapper'

export function Header() {
  const config = useTenantConfig()

  return (
    <header className="border-b border-slate-200 bg-white py-4 sticky top-0 z-50">
      <PageWrapper className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-[var(--tenant-primary)] hover:opacity-80 transition-opacity"
        >
          {config.logoUrl ? (
            <img src={config.logoUrl} alt={`${config.name} Logo`} className="h-10 w-auto" />
          ) : (
            <span>{config.name}</span>
          )}
        </Link>

        <nav className="hidden md:flex gap-6 items-center font-medium text-slate-600">
          <Link to="/" className="hover:text-[var(--tenant-primary)] transition-colors">
            Home
          </Link>
          <Link to="/services" className="hover:text-[var(--tenant-primary)] transition-colors">
            Services
          </Link>
          <Link to="/team" className="hover:text-[var(--tenant-primary)] transition-colors">
            Our Team
          </Link>
          <Link to="/contact" className="hover:text-[var(--tenant-primary)] transition-colors">
            Contact
          </Link>
        </nav>

        {/* Mobile menu button could go here in a future iteration */}
      </PageWrapper>
    </header>
  )
}
