export interface BeforeAfter {
  id: number
  slug: string
  /** Case title — a short, patient-anonymised descriptor (no real names, R7). */
  case_title: string
  /** Treatment category used for client-side filtering (e.g. "Veneers"). */
  treatment_type: string
  /** Plain-text case description / summary. */
  description: string
  /** Relationship — referencing doctor's display name (no direct PII, R7). */
  dentist: string
  /** Absolute or tenant-relative URL to the "before" clinical image. */
  before_image: string
  /** Absolute or tenant-relative URL to the "after" clinical image. */
  after_image: string
  /** When true, the case is pinned to the top of the gallery. */
  is_featured: boolean
  /** Secondary sort key — ascending order within the featured/unfeatured band. */
  display_order: number
}
