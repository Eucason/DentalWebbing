import { SEO } from '../components/SEO'
import { PageWrapper } from '../components/layout/PageWrapper'
import { ContactSection } from '../components/sections/ContactSection'
import { MapSection } from '../components/sections/MapSection'
import { useSectionVisible } from '../hooks/useSectionVisible'

function ContactPage() {
  const showContact = useSectionVisible('contact')
  const showMap = useSectionVisible('map')

  return (
    <>
      <SEO
        title="Contact"
        description="Get in touch with our clinic to book an appointment, ask a question, or find our location and opening hours."
      />

      <div className="border-b border-slate-200 bg-white py-12">
        <PageWrapper>
          <h1 className="text-4xl font-bold text-slate-950">Contact Us</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            We&apos;d love to hear from you - reach out to book an appointment or ask any question.
          </p>
        </PageWrapper>
      </div>

      {showContact && <ContactSection />}
      {showMap && <MapSection />}
    </>
  )
}

export default ContactPage
