import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { JsonLd } from '@/components/json-ld'
import { PromptGrid } from '@/components/prompt-card'
import { PromptGallery } from '@/components/prompt/prompt-gallery'
import { PromptTextPanel } from '@/components/prompt/prompt-text-panel'
import { ShareActions } from '@/components/prompt/share-actions'
import { SectionHeading } from '@/components/section-heading'
import { btn } from '@/lib/button-styles'
import {
  getCategoryBySlug,
  getPromptBySlug,
  getRelatedPrompts,
  prompts,
  tagLabel,
  toSummary,
} from '@/lib/content'
import { formatDate } from '@/lib/format'
import { buildMetadata, categoryPath, promptCanonical, promptJsonLd, promptPath } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return prompts.map((prompt) => ({ slug: prompt.slug }))
}

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const prompt = getPromptBySlug(slug)
  if (!prompt) return {}
  const primary = prompt.images[0]
  const metadata = buildMetadata({
    title: prompt.seoTitle ?? `${prompt.title} — AI Image Prompt`,
    description: prompt.seoDescription ?? prompt.shortDescription,
    path: promptPath(prompt.slug),
    image: { src: primary.src, alt: primary.alt, width: primary.width, height: primary.height },
    type: 'article',
  })
  return { ...metadata, alternates: { canonical: promptCanonical(prompt) } }
}

export default async function PromptPage({ params }: { params: Params }) {
  const { slug } = await params
  const prompt = getPromptBySlug(slug)
  if (!prompt) notFound()
  const category = getCategoryBySlug(prompt.categorySlug)
  const related = getRelatedPrompts(prompt, 6)
  const canonical = promptCanonical(prompt)

  const details: { label: string; value: string }[] = [
    { label: 'Category', value: category?.name ?? '' },
    { label: 'Style', value: prompt.imageStyle ?? '' },
    { label: 'Prompt type', value: prompt.promptType ?? '' },
    { label: 'Aspect ratio', value: prompt.aspectRatio ?? '' },
    { label: 'Suggested model', value: prompt.aiModel ?? '' },
    ...Object.entries(prompt.generationSettings ?? {}).map(([label, value]) => ({
      label,
      value: String(value),
    })),
  ].filter((item) => item.value)

  return (
    <div className="container-page py-8 sm:py-12">
      <JsonLd data={promptJsonLd(prompt, category)} />
      <Breadcrumbs
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Categories', href: '/category/' },
          ...(category ? [{ name: category.name, href: categoryPath(category.slug) }] : []),
          { name: prompt.title, href: promptPath(prompt.slug) },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <PromptGallery slug={prompt.slug} title={prompt.title} images={prompt.images} />
        </div>

        <article className="min-w-0">
          {category ? (
            <Link
              href={categoryPath(category.slug)}
              className="text-sm font-medium text-brand-text hover:underline"
            >
              {category.name}
            </Link>
          ) : null}
          <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">{prompt.title}</h1>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{prompt.shortDescription}</p>

          <div className="mt-6">
            <PromptTextPanel promptText={prompt.promptText} />
          </div>

          <div className="mt-5">
            <ShareActions url={canonical} title={prompt.title} />
          </div>

          {details.length > 0 ? (
            <section aria-labelledby="details-heading" className="mt-8">
              <h2 id="details-heading" className="text-lg font-semibold">
                Prompt details
              </h2>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-border bg-card p-5 text-sm">
                {details.map((item) => (
                  <div key={item.label}>
                    <dt className="text-muted-foreground">{item.label}</dt>
                    <dd className="mt-0.5 font-medium">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {prompt.tags.length > 0 ? (
            <section aria-labelledby="tags-heading" className="mt-8">
              <h2 id="tags-heading" className="text-lg font-semibold">
                Tags
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/prompts/?tag=${encodeURIComponent(tag)}`}
                      className="inline-flex rounded-full bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand-text hover:bg-primary hover:text-primary-foreground"
                    >
                      {tagLabel(tag)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <p className="mt-8 text-sm text-muted-foreground">
            Published <time dateTime={prompt.publishedAt}>{formatDate(prompt.publishedAt)}</time>
            {prompt.updatedAt && prompt.updatedAt !== prompt.publishedAt ? (
              <>
                {' · '}Updated <time dateTime={prompt.updatedAt}>{formatDate(prompt.updatedAt)}</time>
              </>
            ) : null}
          </p>

          <Link href="/prompts/" className={btn({ variant: 'ghost', size: 'md', className: 'mt-4 -ml-3' })}>
            <ArrowLeft aria-hidden="true" />
            Back to Explore
          </Link>
        </article>
      </div>

      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="mt-20">
          <SectionHeading id="related-heading" title="Related prompts" />
          <PromptGrid prompts={related.map(toSummary)} />
        </section>
      ) : null}
    </div>
  )
}
