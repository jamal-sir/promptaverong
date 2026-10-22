import type { MetadataRoute } from 'next'
import { siteConfig } from '@/data/site-config'
import { getPromptsByCategory, populatedCategories, prompts } from '@/lib/content'
import { absoluteUrl, categoryPath, promptPath } from '@/lib/seo'

export const dynamic = 'force-static'

const staticPages = ['/', '/prompts/', '/category/', '/about/', '/contact/', '/privacy-policy/', '/terms-of-use/']

export default function sitemap(): MetadataRoute.Sitemap {
  const newest = prompts.reduce((latest, prompt) => {
    const date = prompt.updatedAt ?? prompt.publishedAt
    return date > latest ? date : latest
  }, '')

  const pages: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: absoluteUrl(path),
    lastModified: path === '/' || path === '/prompts/' ? newest || undefined : undefined,
  }))

  const categoryPages: MetadataRoute.Sitemap = populatedCategories.flatMap((category) => {
    const inCategory = getPromptsByCategory(category.slug)
    const lastModified = inCategory
      .map((prompt) => prompt.updatedAt ?? prompt.publishedAt)
      .sort()
      .at(-1)
    const totalPages = Math.ceil(inCategory.length / siteConfig.pageSize)
    return Array.from({ length: totalPages }, (_, index) => ({
      url: absoluteUrl(index === 0 ? categoryPath(category.slug) : `${categoryPath(category.slug)}page/${index + 1}/`),
      lastModified,
    }))
  })

  const promptPages: MetadataRoute.Sitemap = prompts.map((prompt) => ({
    url: prompt.canonicalUrl ?? absoluteUrl(promptPath(prompt.slug)),
    lastModified: prompt.updatedAt ?? prompt.publishedAt,
  }))

  return [...pages, ...categoryPages, ...promptPages]
}
