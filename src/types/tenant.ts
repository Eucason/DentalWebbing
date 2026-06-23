export interface TenantConfig {
  id: string
  name: string
  domain: string
  apiSubdirectoryPath: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  logoUrl?: string
  contactEmail?: string
  contactPhone?: string
  address?: string
}
