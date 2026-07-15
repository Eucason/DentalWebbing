/**
 * A single row of the `credentials` ACF repeater.
 *
 * `credential_type` is free-form (e.g. "Degree", "Certification", "Fellowship")
 * so operators can classify entries without a code change.
 */
export interface DoctorCredential {
  credential_title: string
  credential_type: string
  institution: string
  year: string
}

export interface Doctor {
  id: number
  slug: string
  name: string
  specialty?: string
  bio?: string
  imageUrl?: string
  /**
   * Legacy flat qualification strings (pre-repeater). Retyped as optional so
   * older tenant content still parses; the mapper folds these into
   * `credentialChips` alongside the structured `credentials` repeater so the
   * UI never branches on which shape arrived.
   */
  qualifications?: string[]
  /** Structured ACF repeater of credentials (new shape). */
  credentials?: DoctorCredential[]
  /**
   * Normalised, render-ready chip list produced by the mapper. Merges legacy
   * `qualifications[]` strings and the new `credentials[]` repeater titles
   * into one list — the single source of truth for the card chip subset and the
   * drawer. Always prefer this field over `qualifications` / `credentials`.
   */
  credentialChips?: string[]
  /** Total years the doctor has been in clinical practice. */
  years_in_practice?: number
  /** Languages the doctor consults in. */
  languages_spoken?: string[]
  /** Optional link to a short personal-intro video. */
  personal_bio_video_url?: string
  /** A short, humanising line shown in the credentials drawer. */
  fun_fact?: string
}
