/**
 * Represents a WordPress page fetched via the REST API.
 * Used by the DynamicPage component to render arbitrary clinic pages.
 */
export interface WpPage {
  id: number
  slug: string
  title: string
  /** Rendered HTML content from WordPress. Sanitize before injecting into the DOM. */
  content: string
  excerpt?: string
  featuredImageUrl?: string
}
