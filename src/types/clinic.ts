export interface ClinicInfo {
  heroTitle: string
  heroSubtitle: string
  heroImageUrl?: string
  address: string
  contactPhone: string
  contactEmail: string
  hours: Record<string, string>
  socialLinks?: Record<string, string>
}
