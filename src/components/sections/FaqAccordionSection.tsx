import { useMemo, useState } from 'react'
import { useFaqs } from '../../hooks/useFaqs'
import { FaqSkeleton } from '../ui/Skeleton'
import type { Faq } from '../../types'
import { buildFaqPageSchema } from '../../utils/jsonLd'

// ---------------------------------------------------------------------------
// FaqAccordionSection
// ---------------------------------------------------------------------------
// Consumes useFaqs() and renders the clinic's FAQs in a single-open accordion.
// Self-hides when the list is empty so the page layout snaps closed cleanly.
//
// State machine:
//   isLoading        → <FaqSkeleton />      (matches the accordion shape)
//   isError || !data → neutral inline alert (no crash, no tenant colors)
//   data.length === 0 → null               (self-hide; product requirement)
//   resolved          → grouped/flat accordion + FAQPage JSON-LD rich snippet
// ---------------------------------------------------------------------------

export function FaqAccordionSection() {
  const { data, isLoading, isError } = useFaqs()

  if (isLoading) return <FaqSkeleton />

  if (isError || !data) {
    return (
      <section className="w-full px-6 py-12" role="alert" aria-label="Frequently asked questions error">
        <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-slate-100 px-6 py-8 text-center text-slate-600">
          <p className="text-lg font-medium">Our FAQs are temporarily unavailable.</p>
          <p className="mt-1 text-sm text-slate-500">
            Please try refreshing the page or contact us directly.
          </p>
        </div>
      </section>
    )
  }

  if (data.length === 0) return null

  return <FaqAccordion data={data} />
}

// ---------------------------------------------------------------------------
// FaqAccordion — resolved accordion UI
// ---------------------------------------------------------------------------

interface FaqAccordionProps {
  data: Faq[]
}

function FaqAccordion({ data }: FaqAccordionProps) {
  // Index of the open item; single-open means clicking any question closes
  // the previously open one. null = nothing open.
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const groups = useMemo(() => buildFaqGroups(data), [data])

  return (
    <section className="w-full bg-white px-6 py-16" aria-label="Frequently asked questions">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--tenant-primary)]">
            Frequently Asked Questions
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950 md:text-4xl">How can we help?</h2>
          <p className="mt-3 text-lg text-slate-600">
            Quick answers to common questions. Can&apos;t find what you need? Reach out directly.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <div key={group.label}>
              {groups.length > 1 && (
                <h3 className="mb-3 border-b border-slate-100 pb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  {group.label}
                </h3>
              )}
              <div className="flex flex-col gap-3">
                {group.items.map((faq) => {
                  const isOpen = openIndex === faq._flatIndex
                  return (
                    <FaqCard
                      key={faq.id}
                      faq={faq}
                      isOpen={isOpen}
                      panelId={`faq-panel-${faq.id}`}
                      buttonId={`faq-button-${faq.id}`}
                      onToggle={() => setOpenIndex(isOpen ? null : faq._flatIndex)}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <FaqJsonLd data={data} />
    </section>
  )
}

// ---------------------------------------------------------------------------
// FaqCard — single collapsible question/answer pair
// ---------------------------------------------------------------------------

interface FaqCardProps {
  faq: Faq & { _flatIndex: number }
  isOpen: boolean
  panelId: string
  buttonId: string
  onToggle: () => void
}

function FaqCard({ faq, isOpen, panelId, buttonId, onToggle }: FaqCardProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <h4 className="m-0">
        <button
          id={buttonId}
          type="button"
          className="flex w-full items-center justify-between gap-4 rounded-xl px-5 py-4 text-left font-medium text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tenant-primary)]"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span>{faq.question}</span>
          <svg
            className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </h4>

      {/*
        grid grid-rows-[0fr] → [1fr] animates height without measuring the DOM:
        the inner wrapper keeps its natural size while the row reveals/hides it.
        Closed panels are hidden from AT via aria-hidden. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!isOpen}
        className="grid transition-all duration-300"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 leading-relaxed text-slate-600">{faq.answer}</div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// FaqJsonLd — FAQPage Schema.org object for local-SEO rich results
// ---------------------------------------------------------------------------

interface FaqJsonLdProps {
  data: Faq[]
}

function FaqJsonLd({ data }: FaqJsonLdProps) {
  const schema = useMemo(
    () => buildFaqPageSchema(data.map((faq) => ({ question: faq.question, answer: faq.answer }))),
    [data]
  )

  return (
    <script
      type="application/ld+json"
      // Payload is derived from our own typed data, never external input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ---------------------------------------------------------------------------
// Grouping helper — flat order of `data` is preserved inside each group
// ---------------------------------------------------------------------------

interface FaqGroup {
  label: string
  items: (Faq & { _flatIndex: number })[]
}

function buildFaqGroups(data: Faq[]): FaqGroup[] {
  const hasCategories = data.some((f) => f.category && f.category.trim().length > 0)
  const indexed = data.map((faq, i) => ({ ...faq, _flatIndex: i }))

  if (!hasCategories) return [{ label: 'All', items: indexed }]

  const order: string[] = []
  const bucket = new Map<string, (Faq & { _flatIndex: number })[]>()
  for (const faq of indexed) {
    const label = (faq.category ?? '').trim() || 'General'
    if (!bucket.has(label)) {
      bucket.set(label, [])
      order.push(label)
    }
    bucket.get(label)!.push(faq)
  }
  return order.map((label) => ({ label, items: bucket.get(label)! }))
}
