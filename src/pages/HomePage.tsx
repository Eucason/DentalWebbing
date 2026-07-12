import { SEO } from '../components/SEO'
import { PageWrapper } from '../components/layout/PageWrapper'
import { DoctorsSection } from '../components/sections/DoctorsSection'
import { FaqAccordionSection } from '../components/sections/FaqAccordionSection'
import { HeroSection } from '../components/sections/HeroSection'
import { InsuranceSection } from '../components/sections/InsuranceSection'
import { ServicesSection } from '../components/sections/ServicesSection'
import { SocialProofSection } from '../components/sections/SocialProofSection'
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
        // Accepted insurance, payment plans, and new-patient offer.
        // Self-hides when the tenant has no insurance config.
        showInsurance && <InsuranceSection />
      }

      {
        // FAQ accordion, groups by category when present. Self-hides when the
        // tenant has no FAQs.
        showFaq && <FaqAccordionSection />
      }
    </>
  )
}

export default HomePage
