import type { AxiosInstance } from 'axios'
import type {
  Doctor,
  Service,
  ClinicInfo,
  TenantConfig,
  ContactFormData,
  ContactFormResponse,
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

/** Strips HTML tags from WP rendered strings. */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
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
  }
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
