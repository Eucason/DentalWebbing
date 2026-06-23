import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTenantConfig } from '../../context/useTenant'
import { PageWrapper } from './PageWrapper'

// ---------------------------------------------------------------------------
// Header — sticky top bar with responsive navigation
// ---------------------------------------------------------------------------
// Desktop (md+): horizontal nav links inline.
// Mobile (<md):  hamburger toggle reveals a disclosure panel.
//
// Accessibility:
//   - Active route is marked with aria-current="page" via <NavLink>.
//   - Hamburger exposes aria-expanded / aria-controls.
//   - All interactive elements have a visible focus-visible ring.
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services', end: false },
  { to: '/team', label: 'Our Team', end: false },
  { to: '/contact', label: 'Contact', end: false },
] as const

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded transition-colors outline-none',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]',
    isActive
      ? 'text-[var(--tenant-primary)] font-semibold'
      : 'text-slate-600 hover:text-[var(--tenant-primary)] font-medium',
  ].join(' ')

export function Header() {
  const config = useTenantConfig()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white py-4">
      <PageWrapper className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-[var(--tenant-primary)] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)] rounded"
        >
          {config.logoUrl ? (
            <img src={config.logoUrl} alt={`${config.name} logo`} className="h-10 w-auto" />
          ) : (
            <span>{config.name}</span>
          )}
        </Link>

        {/* ── Desktop nav ──────────────────────────────────────────────── */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ── Mobile hamburger toggle ──────────────────────────────────── */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded p-2 text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)] md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </PageWrapper>

      {/* ── Mobile disclosure panel ─────────────────────────────────────── */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          className="border-t border-slate-200 bg-white md:hidden"
          aria-label="Mobile navigation"
        >
          <PageWrapper className="flex flex-col py-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                className={navLinkClass}
              >
                <span className="block py-3">{item.label}</span>
              </NavLink>
            ))}
          </PageWrapper>
        </nav>
      )}
    </header>
  )
}

// ---------------------------------------------------------------------------
// Inline icons (no external dep, keeps bundle lean)
// ---------------------------------------------------------------------------

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
