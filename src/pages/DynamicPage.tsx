import { useMemo } from 'react'
import DOMPurify from 'dompurify'
import { Link, useParams } from 'react-router-dom'
import { SEO } from '../components/SEO'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Skeleton } from '../components/ui/Skeleton'
import { useWpPage } from '../hooks/useWpPage'

function DynamicPage() {
  const params = useParams()
  const slug = getSlugFromParams(params)
  const { data: page, isLoading, isError } = useWpPage(slug)
  const sanitizedContent = useMemo(
    () => DOMPurify.sanitize(page?.content ?? ''),
    [page?.content]
  )

  if (isLoading) {
    return (
      <section className="w-full px-6 py-16" role="status" aria-label="Loading page">
        <PageWrapper>
          <Skeleton className="mb-4 h-10 w-3/4 max-w-lg" />
          <div className="mt-6 flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </PageWrapper>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="w-full px-6 py-16" role="alert" aria-label="Page error">
        <PageWrapper>
          <div className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-slate-100 px-6 py-8 text-center text-slate-600">
            <p className="text-lg font-medium">This page couldn&apos;t be loaded right now.</p>
            <p className="mt-1 text-sm text-slate-500">
              Please try refreshing the page or contact us directly.
            </p>
          </div>
        </PageWrapper>
      </section>
    )
  }

  if (!page) {
    return (
      <>
        <SEO title="Page not found" description="The page you are looking for does not exist." />
        <PageWrapper className="py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-tenant-primary">404</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950">Page not found</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            The page you are looking for does not exist.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex rounded bg-tenant-primary px-5 py-3 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--tenant-primary)]"
          >
            Return home
          </Link>
        </PageWrapper>
      </>
    )
  }

  return (
    <>
      <SEO
        title={page.title}
        description={page.excerpt ?? `${page.title} - read more on our website.`}
      />

      <div className="border-b border-slate-200 bg-white py-12">
        <PageWrapper>
          <h1 className="text-4xl font-bold text-slate-950">{page.title}</h1>
          {page.excerpt && (
            <p className="mt-3 max-w-2xl text-lg text-slate-600">{page.excerpt}</p>
          )}
        </PageWrapper>
      </div>

      {page.featuredImageUrl && (
        <div className="bg-slate-50">
          <PageWrapper className="py-8">
            <img
              src={page.featuredImageUrl}
              alt={`${page.title} featured image`}
              className="max-h-96 w-full rounded-xl object-cover shadow-sm"
              loading="eager"
            />
          </PageWrapper>
        </div>
      )}

      <section className="bg-white py-16">
        <PageWrapper>
          <div className="wp-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </PageWrapper>
      </section>
    </>
  )
}

function getSlugFromParams(params: Readonly<Record<string, string | undefined>>): string {
  const rawPath = params.slug ?? params['*'] ?? ''
  const segments = rawPath.split('/').filter(Boolean)
  return segments.at(-1) ?? ''
}

export default DynamicPage
