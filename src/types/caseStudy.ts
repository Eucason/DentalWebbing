/**
 * A single patient case study — a "smile story" in the band.
 *
 * Sourced from the `case_study` CPT. `patient_name` is a pseudonym only
 * (R7): no real names, no diagnosis or procedure dates ever flow through
 * this type. `doctor` is a relationship field resolved to the referring
 * doctor's display name (or an id string when the relationship target is
 * unresolved). `video_url` is optional — when present the card renders a
 * play link; when absent the card renders without one.
 */
export interface CaseStudy {
  id: number
  slug: string
  /** Pseudonym only — never a real patient name (R7). */
  patient_name: string
  /** Treatment category shown as a chip (e.g. "Veneers", "Invisalign"). */
  treatment_type: string
  /** Plain-text story excerpt / body. */
  story_body: string
  /** Absolute or tenant-relative URL to the "before" clinical image. */
  before_image: string
  /** Absolute or tenant-relative URL to the "after" clinical image. */
  after_image: string
  /** Optional link to a video walkthrough of the case. */
  video_url?: string
  /** Relationship — referencing doctor's display name (no direct PII, R7). */
  doctor: string
  /** Sort order within the band (ascending). */
  display_order: number
}
