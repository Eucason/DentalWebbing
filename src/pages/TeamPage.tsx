import { SEO } from '../components/SEO'
import { PageWrapper } from '../components/layout/PageWrapper'
import { DoctorsSection } from '../components/sections/DoctorsSection'
import { useSectionVisible } from '../hooks/useSectionVisible'

function TeamPage() {
  const showTeam = useSectionVisible('team')

  return (
    <>
      <SEO
        title="Our Team"
        description="Meet our experienced dental professionals - a dedicated team committed to delivering outstanding patient care in a welcoming environment."
      />

      <div className="border-b border-slate-200 bg-white py-12">
        <PageWrapper>
          <h1 className="text-4xl font-bold text-slate-950">Our Team</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            Experienced professionals, caring approach
          </p>
        </PageWrapper>
      </div>

      {showTeam && <DoctorsSection />}
    </>
  )
}

export default TeamPage
