export interface ContactFormData {
  name: string
  email: string
  phone: string | null
  message: string
  /**
   * Location-aware appointment request fields (B6). All optional, non-PHI.
   * `location_id` is only relevant once the location CPT exists; until then
   * it remains an opaque string with no validation beyond its type.
   */
  location_id?: string
  /** Free text, e.g. "morning", "afternoon", or a specific time. */
  preferred_time?: string
  /** Non-PHI free text describing the reason for the visit. */
  reason_for_visit?: string
}

export interface ContactFormResponse {
  success: boolean
}
