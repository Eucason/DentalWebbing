import { useMemo, useState } from 'react'
import { useBeforeAfter } from '../../hooks/useBeforeAfter'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import { Card } from '../ui/Card'

// ---------------------------------------------------------------------------
// BeforeAfterSection
// ---------------------------------------------------------------------------
// Gallery of before/after clinical cases. Consumes useBeforeAfter().
//
// Behaviour:
//   Feature flag OFF          → null (opt-in gate, R3)
//   isLoading                 → inline skeleton
//   isError / !data          → null (R2 self-hide — no error UI for galleries)
//   data.length === 0        → null (R2 self-hide)
//   data                      → filterable (treatment_type) grid of cards,
//                               featured cases pinned to top, then sorted by
//                               display_order ascending.
// ---------------------------------------------------------------------------

const ALL_TREATMENTS = 'All'

export function BeforeAfterSection() {
  // ── Feature-flag gate (R3: opt-in Phase-4 flag, defaults OFF) ────────────
  const enabled = useFeatureFlag('beforeAfterGallery', { defaultValue: false })
  if (!enabled) return null

  const { data, isLoading, isError } = useBeforeAfter()
  const [treatment, setTreatment] = useState<string>(ALL_TREATMENTS)

  // ── Available filter options, derived from the data (no hardcoding, R1) ───
  const treatments = useMemo(() => {
    const unique = new Set<string>()
    for (const c of data ?? []) {
      if (c.treatment_type) unique.add(c.treatment_type)
    }
    return [ALL_TREATMENTS, ...[...unique].sort()]
  }, [data])

  // ── Sort: featured first, then display_order ascending ────────────────────
  const cases = useMemo(() => {
    const source = data ?? []
    const filtered =
      treatment === ALL_TREATMENTS
        ? source
        : source.filter((c) => c.treatment_type === treatment)
    return [...filtered].sort((a, b) => {
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1
      return a.display_order - b.display_order
    })
  }, [data, treatment])

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section className="w-full px-6 py-16" role="status" aria-label="Loading before and after gallery">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 h-8 w-56 animate-pulse rounded bg-slate-200" aria-hidden="true" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="flex animate-pulse flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                aria-hidden="true"
              >
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-[4/3] rounded bg-slate-200" />
                  <div className="aspect-[4/3] rounded bg-slate-200" />
                </div>
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-3 w-1/2 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // ── Error / empty → self-hide (R2) ───────────────────────────────────────
  if (isError || !data || data.length === 0 || cases.length === 0) {
    return null
  }

  // ── Resolved data ─────────────────────────────────────────────────────────
  return (
    <section className="w-full px-6 py-16" aria-label="Before and after gallery">
      <div className="mx-auto max-w-5xl">
        {/* ── Section header ───────────────────────────────────────────── */}
        <header className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-950 md:text-4xl">
            Before &amp; After Gallery
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Real results from our patients. Filter by treatment to explore similar cases.
          </p>
        </header>

        {/* ── Treatment filter chips ───────────────────────────────────── */}
        <div
          className="mb-8 flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Filter by treatment type"
        >
          {treatments.map((t) => {
            const active = t === treatment
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTreatment(t)}
                className={
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition ' +
                  (active
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300')
                }
              >
                {t}
              </button>
            )
          })}
        </div>

        {/* ── Cases grid ───────────────────────────────────────────────── */}
        <ul className="grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3" aria-label="Before and after cases">
          {cases.map((c) => (
            <li key={c.id}>
              <Card className="flex h-full flex-col">
                {/* Before / After images side by side */}
                <div className="grid grid-cols-2 gap-0">
                  {c.before_image ? (
                    <img
                      src={c.before_image}
                      alt={`Before — ${c.case_title}`}
                      className="aspect-[4/3] w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="flex aspect-[4/3] w-full items-center justify-center bg-slate-100 text-xs text-slate-500"
                      aria-label={`Before image unavailable for ${c.case_title}`}
                    >
                      Before
                    </div>
                  )}
                  {c.after_image ? (
                    <img
                      src={c.after_image}
                      alt={`After — ${c.case_title}`}
                      className="aspect-[4/3] w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="flex aspect-[4/3] w-full items-center justify-center bg-slate-100 text-xs text-slate-500"
                      aria-label={`After image unavailable for ${c.case_title}`}
                    >
                      After
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-slate-900">{c.case_title}</h3>
                    {c.is_featured && (
                      <span className="shrink-0 rounded-full bg-slate-900 px-2 py-0.5 text-xs font-medium text-white">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-[var(--tenant-primary)]">
                    {c.treatment_type}
                  </p>

                  {c.description && (
                    <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {c.description}
                    </p>
                  )}

                  {c.dentist && (
                    <p className="mt-auto pt-2 text-xs text-slate-500">
                      With <span className="font-medium text-slate-700">{c.dentist}</span>
                    </p>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
