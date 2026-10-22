import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryView, categoryPageHref } from '@/components/category/category-view'
import { siteConfig } from '@/data/site-config'
import { getCategoryBySlug, getPromptsByCategory, populatedCategories } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return populatedCategories.flatMap((category) => {
    const totalPages = Math.ceil(getPromptsByCategory(category.slug).length / siteConfig.pageSize)
    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
      slug: category.slug,
      page: String(index + 2),
    }))
  })
}

type Params = Promise<{ slug: string; page: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, page } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  const pageNumber = Number(page)
  return buildMetadata({
    title: `${category.name} AI Image Prompts — Page ${pageNumber}`,
    description: `${category.description} Page ${pageNumber}.`,
    path: categoryPageHref(slug, pageNumber),
  })
}

export default async function CategoryPaginatedPage({ params }: { params: Params }) {
  const { slug, page } = await params
  const category = getCategoryBySlug(slug)
  const pageNumber = Number(page)
  if (!category || !Number.isInteger(pageNumber) || pageNumber < 2) notFound()
  return <CategoryView category={category} page={pageNumber} />
}
