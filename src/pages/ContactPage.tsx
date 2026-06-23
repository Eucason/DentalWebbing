import { SEO } from '../components/SEO'
import { PageWrapper } from '../components/layout/PageWrapper'
import { ContactSection } from '../components/sections/ContactSection'

// ---------------------------------------------------------------------------
// ContactPage — displays clinic contact info and hours
// No data fetching, no local state, no inline styles.
// Form is intentionally deferred to Task 19.
//
// Layout (top to bottom):
//   1. Static page banner — heading
//   2. <ContactSection />  — address, phone, hours (display-only, no form)
// ---------------------------------------------------------------------------

function ContactPage() {
  return (
    <>
      <SEO
        title="Contact"
        description="Get in touch with our clinic to book an appointment, ask a question, or find our location and opening hours."
      />

      {/* ── Page banner ────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white py-12">
        <PageWrapper>
          <h1 className="text-4xl font-bold text-slate-950">Contact Us</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            We&apos;d love to hear from you — reach out to book an appointment or ask any question.
          </p>
        </PageWrapper>
      </div>

      {/* ── Contact info — address, phone, email, hours ────────────── */}
      <ContactSection />
    </>
  )
}

export default ContactPage
