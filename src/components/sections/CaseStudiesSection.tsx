import { useMemo } from 'react'
import { useCaseStudies } from '../../hooks/useCaseStudies'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import { Card } from '../ui/Card'
import type { CaseStudy } from '../../types'

// ---------------------------------------------------------------------------
// CaseStudiesSection — smile-stories band
// ------------------------------------------------------------------------// Band of patient case-study cards showing before/after images, a
// pseudonym, treatment type, and a story excerpt. Cards with a video_url
// render a play link; cards without before/after images degrade to a
// text-only layout (edge case).
//
// Behaviour:
//   Feature flag OFF           → null (opt-in gate, R3)
//   isLoading                  → inline skeleton band
//   isError / zero studies    → null (R2 self-hide; no empty band)
//   data                       → resorted by display_order ascending and
//                                rendered as a responsive grid of cards.
// ---------------------------------------------------------------------------

export function CaseStudiesSection() {
  // ── Feature-flag gate (R3: opt-in Phase-4 flag, defaults OFF) ────────────
  const enabled = useFeatureFlag('caseStudies', { defaultValue: false })
  if (!enabled) return null

  const { data, isLoading, isError } = useCaseStudies()

  // ── Sorted view (data-driven; no hardcoding, R1) ──────────────────────────
  const studies = useMemo(
    () => [...(data ?? [])].sort((a, b) => a.display_order - b.display_order),
    [data],
  )

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section
        className="w-full px-6 py-12"
        role="status"
        aria-label="Loading smile stories"
      >
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="flex h-80 animate-pulse flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              aria-hidden="true"
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-[4/3] rounded bg-slate-200" />
                <div className="aspect-[4/3] rounded bg-slate-200" />
              </div>
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-1/2 rounded bg-slate-200" />
              <div className="flex flex-col gap-2">
                <div className="h-3 w-full rounded bg-slate-200" />
                <div className="h-3 w-5/6 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ── Error / empty → self-hide (R2) ───────────────────────────────────────
  if (isError || studies.length === 0) return null

  return (
    <section
      className="w-full bg-slate-50 px-6 py-16"
      aria-label="Smile stories"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-3 text-2xl font-bold text-gray-800">Smile Stories</h2>
        <p className="mb-8 max-w-2xl text-gray-600">
          Real patients, real results. Read the stories behind these smiles.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studies.map((study) => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CaseStudyCard({ study }: { study: CaseStudy }) {
  const hasImages = Boolean(study.before_image) || Boolean(study.after_image)

  return (
    <Card className="flex h-full flex-col">
      {/* Before / After images — degrades gracefully when absent */}
      {hasImages && (
        <div className="grid grid-cols-2 gap-0">
          {study.before_image ? (
            <img
              src={study.before_image}
              alt={`Before — ${study.patient_name}'s ${study.treatment_type} treatment`}
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="flex aspect-[4/3] w-full items-center justify-center bg-slate-100 text-xs text-slate-500"
              aria-label={`Before image unavailable for ${study.patient_name}`}
            >
              Before
            </div>
          )}
          {study.after_image ? (
            <img
              src={study.after_image}
              alt={`After — ${study.patient_name}'s ${study.treatment_type} result`}
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="flex aspect-[4/3] w-full items-center justify-center bg-slate-100 text-xs text-slate-500"
              aria-label={`After image unavailable for ${study.patient_name}`}
            >
              After
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900">
            {study.patient_name}
          </h3>
          <span className="shrink-0 rounded-full bg-[var(--tenant-primary)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--tenant-primary)]">
            {study.treatment_type}
          </span>
        </div>

        {study.story_body && (
          <p className="line-clamp-4 flex-1 text-sm leading-relaxed text-slate-600">
            {study.story_body}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between gap-2 pt-2">
          {study.doctor && (
            <p className="text-xs text-slate-500">
              With <span className="font-medium text-slate-700">{study.doctor}</span>
            </p>
          )}

          {study.video_url && (
            <a
              href={study.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[var(--tenant-primary)] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--tenant-primary)] focus:ring-offset-2"
              aria-label={`Play video story for ${study.patient_name}`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-3.5 w-3.5"
              >
                <path d="M6.5 4.5v11l9-5.5-9-5.5z" />
              </svg>
              Play
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}
