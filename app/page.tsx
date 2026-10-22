import type { Metadata } from 'next'
import { CategoryCard } from '@/components/category-card'
import { CtaBand } from '@/components/cta-band'
import { Hero } from '@/components/home/hero'
import { WhySection } from '@/components/home/why-section'
import { PromptGrid } from '@/components/prompt-card'
import { SectionHeading } from '@/components/section-heading'
import { siteConfig } from '@/data/site-config'
import {
  getFeaturedPrompts,
  getLatestPrompts,
  populatedCategories,
  prompts,
  toSummary,
} from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — Premium AI Image Prompt Library`,
  description: siteConfig.description,
  path: '/',
  image: prompts[0]?.images[0]
    ? { ...prompts[0].images[0], alt: prompts[0].images[0].alt }
    : undefined,
})

export default function HomePage() {
  const featured = getFeaturedPrompts(siteConfig.homeFeaturedCount).map(toSummary)
  const latest = getLatestPrompts(siteConfig.homeLatestCount).map(toSummary)
  const showcase = (featured.length >= 3 ? featured : latest).slice(0, 3)

  return (
    <>
      <Hero
        showcase={showcase}
        promptCount={prompts.length}
        categoryCount={populatedCategories.length}
      />

      {featured.length > 0 ? (
        <section aria-labelledby="featured-heading" className="container-page mt-20 sm:mt-24">
          <SectionHeading
            id="featured-heading"
            eyebrow="Handpicked"
            title="Featured prompts"
            description="Standout prompts selected for their detail, clarity, and visual impact."
            href="/prompts/?featured=1"
            hrefLabel="View all featured"
          />
          <PromptGrid prompts={featured} />
        </section>
      ) : null}

      <section aria-labelledby="categories-heading" className="container-page mt-20 sm:mt-24">
        <SectionHeading
          id="categories-heading"
          eyebrow="Browse by style"
          title="Explore categories"
          description="Jump straight to the type of image you want to create."
          href="/category/"
          hrefLabel="All categories"
        />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
          {populatedCategories.slice(0, 10).map((category) => (
            <li key={category.slug}>
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="latest-heading" className="container-page mt-20 sm:mt-24">
        <SectionHeading
          id="latest-heading"
          eyebrow="Just added"
          title="Latest prompts"
          description="Fresh additions to the library, newest first."
          href="/prompts/?sort=newest"
          hrefLabel="View all prompts"
        />
        <PromptGrid prompts={latest} />
      </section>

      <WhySection />
      <CtaBand />
    </>
  )
}
