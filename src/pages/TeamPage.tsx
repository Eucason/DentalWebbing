import { PageWrapper } from '../components/layout/PageWrapper'
import { DoctorsSection } from '../components/sections/DoctorsSection'

// ---------------------------------------------------------------------------
// TeamPage — dedicated page showing the full team roster
// No data fetching, no local state, no inline styles.
//
// Layout (top to bottom):
//   1. Static page banner — heading + subtitle
//   2. <DoctorsSection />  — full doctor grid
// ---------------------------------------------------------------------------

function TeamPage() {
  return (
    <>
      {/* ── Page banner ────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white py-12">
        <PageWrapper>
          <h1 className="text-4xl font-bold text-slate-950">Our Team</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            Experienced professionals, caring approach
          </p>
        </PageWrapper>
      </div>

      {/* ── Full doctors grid ──────────────────────────────────────── */}
      <DoctorsSection />
    </>
  )
}

export default TeamPage
