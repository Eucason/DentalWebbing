import { SEO } from '../components/SEO'
import { PageWrapper } from '../components/layout/PageWrapper'
import { ServicesSection } from '../components/sections/ServicesSection'
import { useSectionVisible } from '../hooks/useSectionVisible'

function ServicesPage() {
  const showServices = useSectionVisible('services')

  return (
    <>
      <SEO
        title="Services"
        description="Explore the full range of dental services we offer - from routine check-ups and cleanings to cosmetic dentistry and orthodontics."
      />

      <div className="border-b border-slate-200 bg-white py-12">
        <PageWrapper>
          <h1 className="text-4xl font-bold text-slate-950">Our Services</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">Everything your smile needs</p>
        </PageWrapper>
      </div>

      {showServices && <ServicesSection />}
    </>
  )
}

export default ServicesPage
