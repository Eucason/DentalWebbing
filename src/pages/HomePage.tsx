import { PageWrapper } from '../components/layout/PageWrapper'
import { DoctorsSection } from '../components/sections/DoctorsSection'
import { HeroSection } from '../components/sections/HeroSection'
import { ServicesSection } from '../components/sections/ServicesSection'

// ---------------------------------------------------------------------------
// HomePage — orchestrates the top-level page composition
// No data fetching, no local state, no inline styles.
//
// Layout (top to bottom):
//   1. <HeroSection />          — full-bleed, tenant-branded
//   2. "What We Offer"          — abbreviated services (top 3)
//   3. "Meet the Team"          — full doctors grid
// ---------------------------------------------------------------------------

function HomePage() {
  return (
    <>
      {/* ── Hero — full-bleed, sits outside PageWrapper intentionally ── */}
      <HeroSection />

      {/* ── Services preview ───────────────────────────────────────── */}
      <section aria-label="Services preview" className="bg-slate-50 py-16">
        <PageWrapper>
          <h2 className="mb-6 text-2xl font-bold text-gray-800">What We Offer</h2>
        </PageWrapper>
        <ServicesSection limit={3} />
      </section>

      {/* ── Doctors / Team ─────────────────────────────────────────── */}
      <section aria-label="Meet the team" className="bg-white py-16">
        <PageWrapper>
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Meet the Team</h2>
        </PageWrapper>
        <DoctorsSection />
      </section>
    </>
  )
}

export default HomePage
