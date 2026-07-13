import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTenantConfig } from '../../context/useTenant'
import { getTenantNavigation } from '../../utils/navigation'
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
  const navItems = getTenantNavigation(config)
  const [menuOpen, setMenuOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // ── WCAG 2.1.2 No Keyboard Trap → deliberately IMPLEMENT a trap only
  //    inside the mobile disclosure. While open, Tab/Shift+Tab cycle only
  //    within the panel and Escape restores focus to the toggle button.
  // ---------------------------------------------------------------------------
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!menuOpen) return

      if (event.key === 'Escape') {
        event.stopPropagation()
        setMenuOpen(false)
        toggleRef.current?.focus()
        return
      }

      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return

      // Collect every focusable node inside the panel.
      const selectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(',')
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(selectors)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first?.focus()
      }
    },
    [menuOpen]
  )

  useEffect(() => {
    if (!menuOpen) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen, handleKeyDown])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

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
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ── Mobile hamburger toggle ──────────────────────────────────── */}
        <button
          ref={toggleRef}
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
          ref={panelRef}
          className="border-t border-slate-200 bg-white md:hidden"
          aria-label="Mobile navigation"
        >
          <PageWrapper className="flex flex-col py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={closeMenu}
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
