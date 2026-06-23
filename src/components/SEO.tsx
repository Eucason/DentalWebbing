import { Helmet } from 'react-helmet-async'
import { useTenant } from '../context/useTenant'

// ---------------------------------------------------------------------------
// SEO — injects page-level metadata into <head> via react-helmet-async
//
// Usage:
//   <SEO title="Services" description="..." />
//
// Title format: "{title} | {clinicName}" or just "{title}" if clinic not ready.
// ---------------------------------------------------------------------------

interface SEOProps {
  title: string
  description: string
  openGraph?: {
    image?: string
    type?: 'website' | 'article'
  }
}

export function SEO({ title, description, openGraph }: SEOProps) {
  const { config } = useTenant()

  const clinicName = config?.name
  const fullTitle = clinicName ? `${title} | ${clinicName}` : title
  const ogImage = openGraph?.image ?? config?.logoUrl
  const ogType = openGraph?.type ?? 'website'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content={ogType} />
    </Helmet>
  )
}
