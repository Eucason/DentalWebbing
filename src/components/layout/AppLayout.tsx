import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAccessibilitySuite } from '../../context/AccessibilitySuiteContext'
import { AccessibilityPanel } from '../accessibility/AccessibilityPanel'
import { Header } from './Header'
import { Footer } from './Footer'

// ---------------------------------------------------------------------------
// AppLayout — the shell skeleton for every route.
//
// WCAG responsibilities:
//   - Skip link jumps past the fixed header straight to #main-content.
//   - #main-content holds tabIndex={-1} so we can move DOM focus to it on
//     every route change — screen-reader users enter the page at the top and
//     keyboard users never get stranded in the old page's DOM.
//   - A visually-hidden polite live region announces the new route so screen-
//     reader users know navigation succeeded even though we don't do a full
//     page reload.
// ---------------------------------------------------------------------------

export function AppLayout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const announcerRef = useRef<HTMLDivElement>(null)
  const suite = useAccessibilitySuite()

  // Route change → move focus to #main-content and announce it.
  // The polite live region always receives the announcement. When the user has
  // enabled screenReaderMode, the suite's assertive region (owned by the
  // provider) receives it *as well*, so voice loops read it next instead of
  // queuing politely behind whatever else is being spoken.
  useEffect(() => {
    // Delay to the next frame so the new page has mounted before we claim focus.
    const id = requestAnimationFrame(() => {
      mainRef.current?.focus()
      const message = `Navigated to ${document.title}`
      if (announcerRef.current) {
        announcerRef.current.textContent = message
      }
      if (suite.prefs.screenReaderMode) {
        suite.announce(message)
      }
    })
    return () => cancelAnimationFrame(id)
  }, [pathname, suite])

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-950">
      {/* WCAG 2.4.1 Bypass Blocks — first focusable element in the page. */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header />

      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="flex-grow focus-visible:outline-none"
      >
        <Outlet />
      </main>

      <Footer />

      {/* Floating assistive-control dock — always present, bottom-right. */}
      <AccessibilityPanel />

      {/* Polite screen-reader live region — announces route changes. */}
      <div
        ref={announcerRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  )
}
