import { useSpecialOffers } from '../../hooks/useSpecialOffers'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import type { SpecialOffer } from '../../types'

// ---------------------------------------------------------------------------
// SpecialOffersSection
// ---------------------------------------------------------------------------
// Horizontal band of active, in-window special-offer cards.
//
// Behaviour:
//   Feature flag OFF                        → null (opt-in gate, R3)
//   isLoading                               → inline skeleton
//   isError / zero active offers            → null (R2 self-hide)
//   data                                    → horizontal band of cards, each
//                                             showing headline, price_display,
//                                             strikethrough regular_price (when
//                                             present), description, and a CTA.
// ---------------------------------------------------------------------------

export function SpecialOffersSection() {
  // ── Feature-flag gate (R3: opt-in Phase-4 flag, defaults OFF) ────────────
  const enabled = useFeatureFlag('specialOffers', { defaultValue: false })
  if (!enabled) return null

  const { data, isLoading, isError } = useSpecialOffers()

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section
        className="w-full px-6 py-12"
        role="status"
        aria-label="Loading special offers"
      >
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl bg-slate-100"
              aria-hidden="true"
            />
          ))}
        </div>
      </section>
    )
  }

  // ── Error / empty → self-hide (R2) ───────────────────────────────────────
  if (isError || data.length === 0) return null

  return (
    <section
      className="w-full bg-slate-50 px-6 py-16"
      aria-label="Special offers"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-2xl font-bold text-gray-800">Special Offers</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  )
}

function OfferCard({ offer }: { offer: SpecialOffer }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {offer.image && (
        <img
          src={offer.image}
          alt=""
          loading="lazy"
          className="aspect-video w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-gray-900">{offer.headline}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
          {offer.offer_description}
        </p>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {offer.price_display}
          </span>
          {offer.regular_price && (
            <span className="text-sm text-gray-400 line-through">
              {offer.regular_price}
            </span>
          )}
        </div>

        <a
          href={offer.cta_url}
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--tenant-primary)] focus:ring-offset-2"
        >
          {offer.cta_label}
        </a>
      </div>
    </article>
  )
}
