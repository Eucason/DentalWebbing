/**
 * A single location of a multi-location tenant.
 *
 * The `location` CPT is additive: it coexists with `clinic-info`, which
 * remains the single source of truth for single-location tenants (see the
 * `B9-location-model` decision). MapSection / ContactSection keep reading from
 * clinic-info for single-location tenants; this type serves the multi-location
 * case where one card renders per location.
 *
 * After the mapper runs, `hours`, `amenity_tags` and `office_photos` are always
 * present (possibly empty arrays) so callers never branch on `undefined`.
 */
export interface LocationHours {
  day: string
  open: string
  close: string
}

export interface Location {
  id: number
  slug: string
  /** Display name of the practice location (e.g. "Apex Orthodontics — Westside"). */
  name: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  zip: string
  phone: string
  /** Embeddable map URL (e.g. a Google Maps iframe src). Sandboxed on render (R6). */
  map_iframe_url: string
  /** Weekly opening hours. Always an array — empty when unpublished. */
  hours: LocationHours[]
  /** Amenity descriptor chips (e.g. "Free Parking", "Wheelchair Accessible"). */
  amenity_tags: string[]
  /** Office-tour photos. Always an array — empty when unpublished. */
  office_photos: string[]
  /** Free-text parking / access notes. */
  parking_notes: string
}
