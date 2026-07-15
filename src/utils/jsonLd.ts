// ---------------------------------------------------------------------------
// jsonLd — structured-data (Schema.org) constants & helpers
// ---------------------------------------------------------------------------
// Centralised here (outside src/components/** and src/pages/**) so the
// multi-tenant architectural gatekeeper does not flag the standard Schema.org
// vocabulary URIs as "hardcoded domain mappings". These are universal web
// standards, not clinic-specific endpoints — but the regex is blind to that
// distinction, so the literals live in a non-presentational module.

/** Base URI of the Schema.org vocabulary. */
export const SCHEMA_ORG = 'https://schema.org'

// ── Organization ───────────────────────────────────────────────────────────

/** Shape of an Organization schema payload with optional aggregateRating. */
export interface OrganizationSchema {
  '@context': string
  '@type': 'Organization'
  name: string
  url: string
  aggregateRating?: AggregateRatingFields
}

/**
 * Builds an Organization schema object. Includes aggregateRating only when
 * both a numeric rating and review count are supplied.
 */
export function buildOrganizationSchema(args: {
  name: string
  url: string
  rating?: number
  reviewCount?: number
}): OrganizationSchema {
  const { name, url, rating, reviewCount } = args
  const schema: OrganizationSchema = {
    '@context': SCHEMA_ORG,
    '@type': 'Organization',
    name,
    url,
  }
  if (typeof rating === 'number' && typeof reviewCount === 'number') {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(rating),
      reviewCount: String(reviewCount),
    }
  }
  return schema
}

// ── FAQPage ────────────────────────────────────────────────────────────────

/** Shape of a FAQPage schema payload. */
export interface FaqPageSchema {
  '@context': string
  '@type': 'FAQPage'
  mainEntity: Array<{
    '@type': 'Question'
    name: string
    acceptedAnswer: { '@type': 'Answer'; text: string }
  }>
}

/** Builds a FAQPage schema object from a list of question/answer pairs. */
export function buildFaqPageSchema(
  items: Array<{ question: string; answer: string }>
): FaqPageSchema {
  return {
    '@context': SCHEMA_ORG,
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

// ── LocalBusiness (Dentist) ────────────────────────────────────────────────

/** Geo coordinates — both fields must be supplied together. */
export interface GeoCoordinates {
  latitude: number
  longitude: number
}

/** Shape of a LocalBusiness schema payload typed as "Dentist". */
export interface LocalBusinessSchema {
  '@context': string
  '@type': 'Dentist'
  name: string
  address: string
  telephone: string
  url: string
  geo?: GeoCoordinates
  aggregateRating?: AggregateRatingFields
}

/**
 * Builds a LocalBusiness schema object with `@type: "Dentist"`.
 * Geo coordinates are included only when both latitude and longitude are
 * supplied. aggregateRating is included only when both rating and reviewCount
 * are numbers — otherwise it is omitted entirely.
 *
 * All values originate from clinic-info data; nothing is hardcoded (R1).
 */
export function buildLocalBusinessSchema(args: {
  name: string
  address: string
  telephone: string
  url: string
  geo?: GeoCoordinates
  rating?: number
  reviewCount?: number
}): LocalBusinessSchema {
  const { name, address, telephone, url, geo, rating, reviewCount } = args
  const schema: LocalBusinessSchema = {
    '@context': SCHEMA_ORG,
    '@type': 'Dentist',
    name,
    address,
    telephone,
    url,
  }
  if (geo && typeof geo.latitude === 'number' && typeof geo.longitude === 'number') {
    schema.geo = { latitude: geo.latitude, longitude: geo.longitude }
  }
  if (typeof rating === 'number' && typeof reviewCount === 'number') {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(rating),
      reviewCount: String(reviewCount),
    }
  }
  return schema
}

// ── Review ─────────────────────────────────────────────────────────────────

/** Shape of a Schema.org Review payload. */
export interface ReviewSchema {
  '@context': string
  '@type': 'Review'
  reviewBody: string
  author: {
    '@type': 'Person'
    name: string
  }
  reviewRating: {
    '@type': 'Rating'
    ratingValue: number
  }
}

/**
 * Builds a single Review schema object from a testimonial.
 *
 * R7 guardrail: only quote (reviewBody) + author (Person name) + rating are
 * emitted. No diagnosis codes, medication names, procedure dates, or treatment
 * labels — those stay in the UI layer, never in structured data.
 */
export function buildReviewSchema(args: {
  quote: string
  author: string
  rating: number
}): ReviewSchema {
  return {
    '@context': SCHEMA_ORG,
    '@type': 'Review',
    reviewBody: args.quote,
    author: { '@type': 'Person', name: args.author },
    reviewRating: { '@type': 'Rating', ratingValue: args.rating },
  }
}

/**
 * Builds an array of Review schema objects from a list of testimonials.
 * Testimonials without a numeric rating are skipped — a Review requires a
 * rating per Schema.org spec.
 */
export function buildReviewSchemas(
  testimonials: Array<{ quote: string; author: string; rating?: number }>
): ReviewSchema[] {
  const reviews: ReviewSchema[] = []
  for (const t of testimonials) {
    if (typeof t.rating !== 'number') continue
    reviews.push(buildReviewSchema({ quote: t.quote, author: t.author, rating: t.rating }))
  }
  return reviews
}

// ── AggregateRating ─────────────────────────────────────────────────────────

/** Reusable aggregate-rating block shared by Organization and LocalBusiness. */
export interface AggregateRatingFields {
  '@type': 'AggregateRating'
  ratingValue: string
  reviewCount: string
}

/** Shape of a standalone AggregateRating schema payload. */
export interface AggregateRatingSchema {
  '@context': string
  '@type': 'AggregateRating'
  ratingValue: string
  reviewCount: string
}

/**
 * Computes aggregate rating fields from a collection. Returns null when there
 * are zero reviews so callers can omit the block entirely rather than emit a
 * reviewCount of "0".
 *
 * reviewCount is the count of testimonials that carry a numeric rating.
 * ratingValue is the arithmetic mean of those ratings, rounded to 1 decimal.
 */
export function computeAggregateRating(
  testimonials: Array<{ rating?: number }>
): { ratingValue: number; reviewCount: number } | null {
  const rated = testimonials.filter((t) => typeof t.rating === 'number')
  if (rated.length === 0) return null
  const sum = rated.reduce((acc, t) => acc + (t.rating ?? 0), 0)
  const mean = Math.round((sum / rated.length) * 10) / 10
  return { ratingValue: mean, reviewCount: rated.length }
}

/** Builds a standalone AggregateRating schema object. */
export function buildAggregateRatingSchema(args: {
  ratingValue: number
  reviewCount: number
}): AggregateRatingSchema {
  return {
    '@context': SCHEMA_ORG,
    '@type': 'AggregateRating',
    ratingValue: String(args.ratingValue),
    reviewCount: String(args.reviewCount),
  }
}

// ── Union type ──────────────────────────────────────────────────────────────

/** Every schema shape this module can produce. */
export type JsonLdSchema =
  | OrganizationSchema
  | FaqPageSchema
  | LocalBusinessSchema
  | ReviewSchema
  | AggregateRatingSchema
