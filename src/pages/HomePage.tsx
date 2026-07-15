import { SEO } from '../components/SEO'
import { PageWrapper } from '../components/layout/PageWrapper'
import { BeforeAfterSection } from '../components/sections/BeforeAfterSection'
import { CaseStudiesSection } from '../components/sections/CaseStudiesSection'
import { DoctorsSection } from '../components/sections/DoctorsSection'
import { FinancingSection } from '../components/sections/FinancingSection'
import { FaqAccordionSection } from '../components/sections/FaqAccordionSection'
import { HeroSection } from '../components/sections/HeroSection'
import { InsuranceSection } from '../components/sections/InsuranceSection'
import { ServicesSection } from '../components/sections/ServicesSection'
import { SocialProofSection } from '../components/sections/SocialProofSection'
import { SpecialOffersSection } from '../components/sections/SpecialOffersSection'
import { TestimonialsSection } from '../components/sections/TestimonialsSection'
import { useSectionVisible } from '../hooks/useSectionVisible'

function HomePage() {
  const showHero = useSectionVisible('hero')
  const showServices = useSectionVisible('services')
  const showTeam = useSectionVisible('team')
  const showTestimonials = useSectionVisible('testimonials')
  const showSocialProof = useSectionVisible('socialProof')
  const showInsurance = useSectionVisible('insurance')
  const showFaq = useSectionVisible('faq')

  return (
    <>
      <SEO
        title="Home"
        description="Welcome to our dental clinic - compassionate, professional care for your whole family. Book your appointment today."
      />

      {showHero && <HeroSection />}

      {showServices && (
        <section aria-label="Services preview" className="bg-slate-50 py-16">
          <PageWrapper>
            <h2 className="mb-6 text-2xl font-bold text-gray-800">What We Offer</h2>
          </PageWrapper>
          <ServicesSection limit={3} />
        </section>
      )}

      {showTeam && (
        <section aria-label="Meet the team" className="bg-white py-16">
          <PageWrapper>
            <h2 className="mb-6 text-2xl font-bold text-gray-800">Meet the Team</h2>
          </PageWrapper>
          <DoctorsSection />
        </section>
      )}

      {
        // Full-bleed dark editorial canvas — self-contained, no outer wrapper.
        // The component degrades to a centered symmetric layout if this tenant
        // has fewer than 3 testimonials (handled internally).
        showTestimonials && <TestimonialsSection limit={6} />
      }

      {
        // Aggregate trust signals: ratings, review count, accreditations, awards.
        // Self-hides when the tenant has no social metrics.
        showSocialProof && <SocialProofSection />
      }

      {
        // Special-offer band. Opt-in via the specialOffers feature flag (R3 —
        // defaults OFF; the section enforces its own gate, so no per-render
        // flag check is needed here). Self-hides when the tenant has no
        // active, in-window offers (R2).
        <SpecialOffersSection />
      }

      {
        // Accepted insurance, payment plans, and new-patient offer.
        // Self-hides when the tenant has no insurance config.
        showInsurance && <InsuranceSection />
      }

      {
        // Financing band. Opt-in via the financing feature flag (R3 — defaults
        // OFF; the section enforces its own gate, so no per-render flag check
        // is needed here). Self-hides when the tenant has no accepted options
        // (R2).
        <FinancingSection />
      }

      {
        // Before/after case gallery. Opt-in via the beforeAfterGallery feature
        // flag (R3 — defaults OFF; the section enforces its own gate, so no
        // per-render flag check is needed here). Self-hides when the tenant has
        // no published cases (R2).
        <BeforeAfterSection />
      }

      {
        // FAQ accordion, groups by category when present. Self-hides when the
        // tenant has no FAQs.
        showFaq && <FaqAccordionSection />
      }

      {
        // Smile-stories band. Opt-in via the caseStudies feature flag (R3 —
        // defaults OFF; the section enforces its own gate, so no per-render
        // flag check is needed here). Self-hides when the tenant has no
        // published case studies (R2).
        <CaseStudiesSection />
      }
    </>
  )
}

export default HomePage
