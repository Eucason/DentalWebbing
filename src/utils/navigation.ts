import type { TenantConfig, TenantNavigationItem } from '../types'

export const DEFAULT_NAV_ITEMS: TenantNavigationItem[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services', end: false },
  { to: '/team', label: 'Our Team', end: false },
  { to: '/contact', label: 'Contact', end: false },
]

export function getTenantNavigation(config: TenantConfig): TenantNavigationItem[] {
  const configuredItems = config.navigation?.reduce<TenantNavigationItem[]>((items, item) => {
    const to = normalizeInternalPath(item.to)
    const label = item.label.trim()

    if (!to || label.length === 0) return items

    items.push({
      to,
      label,
      end: item.end ?? to === '/',
    })

    return items
  }, [])

  return configuredItems && configuredItems.length > 0 ? configuredItems : DEFAULT_NAV_ITEMS
}

export function getFooterNavigation(config: TenantConfig): TenantNavigationItem[] {
  return getTenantNavigation(config).filter((item) => item.to !== '/')
}

function normalizeInternalPath(to: string): string | null {
  const trimmed = to.trim()
  if (trimmed.length === 0) return null
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('//')) {
    return null
  }
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return trimmed
  return `/${trimmed}`
}
