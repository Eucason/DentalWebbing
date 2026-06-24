import { SEO } from '../components/SEO'
import { PageWrapper } from '../components/layout/PageWrapper'
import { DoctorsSection } from '../components/sections/DoctorsSection'
import { HeroSection } from '../components/sections/HeroSection'
import { ServicesSection } from '../components/sections/ServicesSection'
import { useSectionVisible } from '../hooks/useSectionVisible'

function HomePage() {
  const showHero = useSectionVisible('hero')
  const showServices = useSectionVisible('services')
  const showTeam = useSectionVisible('team')

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
    </>
  )
}

export default HomePage
