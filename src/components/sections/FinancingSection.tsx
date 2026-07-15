import { useMemo } from 'react'
import { useFinancingOptions } from '../../hooks/useFinancingOptions'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import { Skeleton } from '../ui/Skeleton'
import type { FinancingOption } from '../../types'

// ---------------------------------------------------------------------------
// FinancingSection — financing band
// ---------------------------------------------------------------------------
// Horizontal band of financing option cards shown to patients: the clinic's
// own in-house plan rendered with distinct styling alongside accepted
// third-party lenders.
//
// Behaviour:
//   Feature flag OFF                → null (opt-in gate, R3)
//   isLoading                       → inline skeleton band
//   isError / zero accepted options → null (R2 self-hide)
//   data                            → resorted by display_order and rendered
//                                     as a responsive grid of cards, each with
//                                     logo, provider_name, description,
//                                     monthly_payment_display, and an optional
//                                     pre-qualify CTA.
// ---------------------------------------------------------------------------

export function FinancingSection() {
  // ── Feature-flag gate (R3: opt-in Phase-4 flag, defaults OFF) ────────────
  const enabled = useFeatureFlag('financing', { defaultValue: false })
  if (!enabled) return null

  const { data, isLoading, isError } = useFinancingOptions()

  // ── Sorted, accepted-only view (data-driven; no hardcoding) ──────────────
  const options = useMemo(
    () =>
      [...(data ?? [])]
        .filter((o) => o.accepted)
        .sort((a, b) => a.display_order - b.display_order),
    [data],
  )

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section
        className="w-full px-6 py-12"
        role="status"
        aria-label="Loading financing options"
      >
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="flex h-56 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              aria-hidden="true"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-5 w-3/4" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
              <Skeleton className="mt-auto h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ── Error / empty → self-hide (R2) ───────────────────────────────────────
  if (isError || options.length === 0) return null

  return (
    <section
      className="w-full bg-slate-50 px-6 py-16"
      aria-label="Financing options"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-3 text-2xl font-bold text-gray-800">
          Flexible Payment Options
        </h2>
        <p className="mb-8 max-w-2xl text-gray-600">
          We offer a range of payment plans to help you spread the cost of your
          treatment. Check your eligibility in minutes with no impact on your
          credit score.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((option) => (
            <FinancingCard key={option.id} option={option} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FinancingCard({ option }: { option: FinancingOption }) {
  const isInHouse = option.is_in_house_plan

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ${
        isInHouse
          ? 'border-l-4 border-l-[var(--tenant-primary)] border-t border-r border-b border-slate-200'
          : 'border border-slate-200'
      }`}
    >
      <div className="flex flex-1 flex-col p-6">
        {/* Logo */}
        {option.logo ? (
          <img
            src={option.logo}
            alt=""
            loading="lazy"
            className="mb-4 h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500"
            aria-hidden="true"
          >
            {option.provider_name.charAt(0)}
          </div>
        )}

        {/* In-house vs third-party badge */}
        <span
          className={`mb-3 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isInHouse
              ? 'bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)]'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {isInHouse ? 'In-house plan' : 'Third-party lender'}
        </span>

        {/* Provider name + description */}
        <h3 className="text-lg font-semibold text-gray-900">
          {option.provider_name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
          {option.description}
        </p>

        {/* Monthly payment display */}
        {option.monthly_payment_display && (
          <p className="mt-4 text-xl font-bold text-gray-900">
            {option.monthly_payment_display}
          </p>
        )}

        {/* Pre-qualify CTA — only when a URL is supplied */}
        {option.pre_qualify_url && (
          <a
            href={option.pre_qualify_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--tenant-primary)] focus:ring-offset-2"
          >
            Check eligibility
          </a>
        )}
      </div>
    </article>
  )
}
