import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryView } from '@/components/category/category-view'
import { getCategoryBySlug, populatedCategories } from '@/lib/content'
import { buildMetadata, categoryPath } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return populatedCategories.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  return buildMetadata({
    title: category.seoTitle ?? `${category.name} AI Image Prompts`,
    description: category.seoDescription ?? category.description,
    path: categoryPath(category.slug),
    image: { src: category.image, alt: `${category.name} prompt examples`, width: 896, height: 1200 },
  })
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()
  return <CategoryView category={category} page={1} />
}
