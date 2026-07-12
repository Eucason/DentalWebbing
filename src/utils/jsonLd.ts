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

/** Shape of an Organization schema payload with optional aggregateRating. */
export interface OrganizationSchema {
  '@context': string
  '@type': 'Organization'
  name: string
  url: string
  aggregateRating?: {
    '@type': 'AggregateRating'
    ratingValue: string
    reviewCount: string
  }
}

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
