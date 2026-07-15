import type { AxiosInstance } from 'axios'
import type {
  Doctor,
  Service,
  Testimonial,
  ClinicInfo,
  TenantConfig,
  ContactFormData,
  ContactFormResponse,
  WpPage,
  Faq,
  SocialMetrics,
  InsuranceConfig,
} from '../types'

// ---------------------------------------------------------------------------
// Raw WordPress REST API shapes
// ---------------------------------------------------------------------------
// These are the actual shapes returned by the WP REST API before mapping.
// They are private to this module — nothing outside should import them.

interface WpPost {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  acf?: Record<string, unknown>
  featured_media?: number
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string }>
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Reusable textarea used as a safe entity-decoding target. */
const decodeTextArea = typeof document !== 'undefined'
  ? document.createElement('textarea')
  : (null as unknown as HTMLTextAreaElement)

/**
 * Decodes HTML entities (named, decimal numeric, hex numeric) into their
 * characters. WP renders curly quotes, apostrophes, ampersands, em-dashes etc.
 * as encoded entities (`&#039;`, `&amp;`, `&#8220;`), which must be decoded back to
 * text before display — otherwise they render literally in the UI.
 *
 * Browser-only (textarea decoding); this module runs client-side (Vite SPA).
 */
function decodeHtmlEntities(html: string): string {
  if (typeof document === 'undefined') return html
  decodeTextArea.innerHTML = html
  return decodeTextArea.value
}

/**
 * Strips HTML tags from WP rendered strings and decodes any HTML entities left
 * behind so the result is plain, display-ready text.
 */
function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, '')).trim()
}

/** Safely extracts a featured image URL from an embedded WP post. */
function extractFeaturedImageUrl(post: WpPost): string | undefined {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url
}

// ---------------------------------------------------------------------------
// Tenant Config
// ---------------------------------------------------------------------------

/**
 * Fetches the tenant configuration for the given domain.
 * Used by TenantContext on mount; downstream code should rely on the already-
 * resolved TenantConfig from context rather than calling this directly.
 */
export async function fetchTenantConfig(
  /** A plain fetch-compatible base URL — intentionally does not take an AxiosInstance
   *  because TenantContext calls this before the Axios client is created. */
  apiHost: string,
  configPath: string,
  domain: string
): Promise<TenantConfig> {
  const url = `${apiHost}${configPath}?domain=${encodeURIComponent(domain)}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Tenant config fetch failed: ${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<TenantConfig>
}

// ---------------------------------------------------------------------------
// Doctors
// ---------------------------------------------------------------------------

/**
 * Fetches the list of doctors from the WP REST API and maps them to the
 * typed `Doctor` interface.
 */
export async function fetchDoctors(api: AxiosInstance): Promise<Doctor[]> {
  const { data } = await api.get<WpPost[]>('/wp-json/wp/v2/doctors', {
    params: { _embed: true, per_page: 100 },
  })

  return data.map(
    (post): Doctor => ({
      id: post.id,
      slug: post.slug,
      name: stripHtml(post.title.rendered),
      specialty: typeof post.acf?.specialty === 'string' ? post.acf.specialty : undefined,
      bio: post.excerpt?.rendered ? stripHtml(post.excerpt.rendered) : undefined,
      imageUrl: extractFeaturedImageUrl(post),
      qualifications: Array.isArray(post.acf?.qualifications)
        ? (post.acf.qualifications as string[])
        : undefined,
    })
  )
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

/**
 * Fetches the list of dental services from the WP REST API and maps them
 * to the typed `Service` interface.
 */
export async function fetchServices(api: AxiosInstance): Promise<Service[]> {
  const { data } = await api.get<WpPost[]>('/wp-json/wp/v2/services', {
    params: { _embed: true, per_page: 100 },
  })

  return data.map(
    (post): Service => ({
      id: post.id,
      slug: post.slug,
      name: stripHtml(post.title.rendered),
      description: stripHtml(post.content.rendered),
      iconUrl: typeof post.acf?.iconUrl === 'string' ? post.acf.iconUrl : undefined,
      imageUrl: extractFeaturedImageUrl(post),
    })
  )
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

/**
 * Fetches the list of patient testimonials from the WP REST API and maps them
 * to the typed `Testimonial` interface.
 */
export async function fetchTestimonials(api: AxiosInstance): Promise<Testimonial[]> {
  const { data } = await api.get<WpPost[]>('/wp-json/wp/v2/testimonials', {
    params: { _embed: true, per_page: 100 },
  })

  return data.map(
    (post): Testimonial => ({
      id: post.id,
      quote: post.content?.rendered ? stripHtml(post.content.rendered) : '',
      author: stripHtml(post.title.rendered),
      rating: typeof post.acf?.rating === 'number' ? post.acf.rating : undefined,
      location: typeof post.acf?.location === 'string' ? post.acf.location : undefined,
      imageUrl: extractFeaturedImageUrl(post),
      video_url: typeof post.acf?.video_url === 'string' ? post.acf.video_url : undefined,
      video_thumbnail:
        typeof post.acf?.video_thumbnail === 'string' ? post.acf.video_thumbnail : undefined,
      source_platform:
        typeof post.acf?.source_platform === 'string' ? post.acf.source_platform : undefined,
      treatment_received:
        typeof post.acf?.treatment_received === 'string'
          ? post.acf.treatment_received
          : undefined,
    })
  )
}

// ---------------------------------------------------------------------------
// Clinic Info
// ---------------------------------------------------------------------------

/**
 * Fetches the clinic's primary information (hero content, contact details,
 * hours) from the WP REST API and maps it to the `ClinicInfo` interface.
 */
export async function fetchClinicInfo(api: AxiosInstance): Promise<ClinicInfo> {
  const { data } = await api.get<{ acf?: Record<string, unknown> }>(
    '/wp-json/dentalwebbing/v1/clinic-info'
  )

  const acf = data.acf ?? {}

  return {
    heroTitle: typeof acf.heroTitle === 'string' ? acf.heroTitle : '',
    heroSubtitle: typeof acf.heroSubtitle === 'string' ? acf.heroSubtitle : '',
    heroImageUrl: typeof acf.heroImageUrl === 'string' ? acf.heroImageUrl : undefined,
    address: typeof acf.address === 'string' ? acf.address : '',
    contactPhone: typeof acf.contactPhone === 'string' ? acf.contactPhone : '',
    contactEmail: typeof acf.contactEmail === 'string' ? acf.contactEmail : '',
    hours:
      acf.hours !== null && typeof acf.hours === 'object' && !Array.isArray(acf.hours)
        ? (acf.hours as Record<string, string>)
        : {},
    socialLinks:
      acf.socialLinks !== null &&
      typeof acf.socialLinks === 'object' &&
      !Array.isArray(acf.socialLinks)
        ? (acf.socialLinks as Record<string, string>)
        : undefined,
    socialMetrics: mapSocialMetrics(acf.socialMetrics),
    insurance: mapInsuranceConfig(acf.insurance),
    mapIframeUrl: typeof acf.mapIframeUrl === 'string' ? acf.mapIframeUrl : undefined,
  }
}

// ---------------------------------------------------------------------------
// ACF mappers (kept private — callers consume the typed ClinicInfo shape)
// ---------------------------------------------------------------------------

/**
 * Safely maps a raw ACF social-metrics object (any shape from WP) to the typed
 * `SocialMetrics` interface. Returns `null` when the input is missing or not a
 * plain object, so the section can self-hide cleanly.
 */
function mapSocialMetrics(raw: unknown): SocialMetrics | undefined {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return undefined
  const v = raw as Record<string, unknown>

  const accreditations = Array.isArray(v.accreditations)
    ? (v.accreditations.filter((x) => typeof x === 'string') as string[])
    : undefined
  const awards = Array.isArray(v.awards)
    ? (v.awards.filter((x) => typeof x === 'string') as string[])
    : undefined

  return {
    googleRating: typeof v.googleRating === 'number' ? v.googleRating : undefined,
    googleReviewCount: typeof v.googleReviewCount === 'number' ? v.googleReviewCount : undefined,
    rating: typeof v.rating === 'number' ? v.rating : undefined,
    reviewCount: typeof v.reviewCount === 'number' ? v.reviewCount : undefined,
    yearsInBusiness: typeof v.yearsInBusiness === 'number' ? v.yearsInBusiness : undefined,
    accreditations,
    awards,
  }
}

/**
 * Safely maps a raw ACF insurance object (any shape from WP) to the typed
 * `InsuranceConfig` interface. Returns `undefined` when the input is missing
 * or not a plain object, so the section can self-hide cleanly.
 */
function mapInsuranceConfig(raw: unknown): InsuranceConfig | undefined {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return undefined
  const v = raw as Record<string, unknown>

  const acceptedProviders = Array.isArray(v.acceptedProviders)
    ? (v.acceptedProviders.filter((x) => typeof x === 'string') as string[])
    : undefined
  const paymentPlans = Array.isArray(v.paymentPlans)
    ? (v.paymentPlans.filter((x) => typeof x === 'string') as string[])
    : undefined

  let newPatientSpecial: InsuranceConfig['newPatientSpecial']
  if (
    v.newPatientSpecial !== null &&
    typeof v.newPatientSpecial === 'object' &&
    !Array.isArray(v.newPatientSpecial)
  ) {
    const o = v.newPatientSpecial as Record<string, unknown>
    if (typeof o.headline === 'string') {
      newPatientSpecial = {
        headline: o.headline,
        description: typeof o.description === 'string' ? o.description : '',
        price: typeof o.price === 'string' ? o.price : undefined,
        ctaLabel: typeof o.ctaLabel === 'string' ? o.ctaLabel : undefined,
        ctaHref: typeof o.ctaHref === 'string' ? o.ctaHref : undefined,
      }
    }
  }

  return {
    acceptedProviders,
    paymentPlans,
    newPatientSpecial,
  }
}

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------

/**
 * Fetches the list of frequently-asked questions from the WP REST API and maps
 * them to the typed `Faq` interface.
 */
export async function fetchFaqs(api: AxiosInstance): Promise<Faq[]> {
  const { data } = await api.get<WpPost[]>('/wp-json/wp/v2/faqs', {
    params: { _embed: true, per_page: 100 },
  })

  return data.map(
    (post): Faq => ({
      id: post.id,
      question: post.title?.rendered ? stripHtml(post.title.rendered) : '',
      answer: post.content?.rendered ? stripHtml(post.content.rendered) : '',
      category: typeof post.acf?.category === 'string' ? post.acf.category : undefined,
    })
  )
}

// ---------------------------------------------------------------------------
// Contact Form
// ---------------------------------------------------------------------------

/**
 * Submits the contact form payload to the WordPress REST API.
 * Returns `{ success: true }` on HTTP 200; throws on any other status.
 */
export async function submitContactForm(
  api: AxiosInstance,
  payload: ContactFormData
): Promise<ContactFormResponse> {
  const { data } = await api.post<ContactFormResponse>('/wp-json/dentalwebbing/v1/contact', payload)
  return data
}

// ---------------------------------------------------------------------------
// Dynamic Pages
// ---------------------------------------------------------------------------

/**
 * Fetches a single WordPress page by its URL slug.
 *
 * Returns the mapped `WpPage` if found, or `null` if the slug doesn't match
 * any published page in the tenant's WordPress site.
 *
 * Used by the DynamicPage component to render arbitrary clinic-created pages
 * without requiring code changes or redeployment.
 */
export async function fetchPageBySlug(api: AxiosInstance, slug: string): Promise<WpPage | null> {
  const { data } = await api.get<WpPost[]>('/wp-json/wp/v2/pages', {
    params: { slug, _embed: true, per_page: 1 },
  })

  if (!data || data.length === 0) return null

  const post = data[0]
  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    content: post.content.rendered,
    excerpt: post.excerpt?.rendered ? stripHtml(post.excerpt.rendered) : undefined,
    featuredImageUrl: extractFeaturedImageUrl(post),
  }
}
