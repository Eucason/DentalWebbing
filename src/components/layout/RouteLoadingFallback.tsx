import { PageSkeleton } from '../ui/Skeleton'

/**
 * Suspense fallback rendered while a lazy route module is being fetched.
 * Uses PageSkeleton so the loading state mirrors the eventual page layout.
 */
export function RouteLoadingFallback() {
  return <PageSkeleton />
}
