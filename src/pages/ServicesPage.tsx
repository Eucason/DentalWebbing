import { SEO } from '../components/SEO'
import { PageWrapper } from '../components/layout/PageWrapper'
import { ServicesSection } from '../components/sections/ServicesSection'

// ---------------------------------------------------------------------------
// ServicesPage — dedicated page showing the full services list
// No data fetching, no local state, no inline styles.
//
// Layout (top to bottom):
//   1. Static page banner — heading + subtitle
//   2. <ServicesSection />  — no limit, all services shown
// ---------------------------------------------------------------------------

function ServicesPage() {
  return (
    <>
      <SEO
        title="Services"
        description="Explore the full range of dental services we offer — from routine check-ups and cleanings to cosmetic dentistry and orthodontics."
      />

      {/* ── Page banner ────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white py-12">
        <PageWrapper>
          <h1 className="text-4xl font-bold text-slate-950">Our Services</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">Everything your smile needs</p>
        </PageWrapper>
      </div>

      {/* ── Full services grid — no limit ──────────────────────────── */}
      <ServicesSection />
    </>
  )
}

export default ServicesPage
