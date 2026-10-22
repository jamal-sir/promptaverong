import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import type { PromptSummary } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { categoryPath, promptPath } from '@/lib/seo'

export function PromptCard({
  prompt,
  priority = false,
  showDate = true,
}: {
  prompt: PromptSummary
  priority?: boolean
  showDate?: boolean
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={prompt.image.src}
          alt={prompt.image.alt}
          width={prompt.image.width}
          height={prompt.image.height}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {prompt.isFeatured ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-[#3d2fb0] shadow-sm">
            <Star className="size-3 fill-current" aria-hidden="true" />
            Featured
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link
          href={categoryPath(prompt.categorySlug)}
          className="relative z-10 w-fit text-xs font-medium text-brand-text hover:underline"
        >
          {prompt.categoryName}
        </Link>
        <h3 className="text-base font-semibold leading-snug">
          <Link
            href={promptPath(prompt.slug)}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {prompt.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{prompt.shortDescription}</p>
        {showDate ? (
          <time dateTime={prompt.publishedAt} className="mt-auto pt-1 text-xs text-muted-foreground">
            {formatDate(prompt.publishedAt)}
          </time>
        ) : null}
      </div>
    </article>
  )
}

export function PromptGrid({
  prompts,
  priorityCount = 0,
}: {
  prompts: PromptSummary[]
  priorityCount?: number
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
      {prompts.map((prompt, index) => (
        <li key={prompt.slug} className="contents">
          <PromptCard prompt={prompt} priority={index < priorityCount} />
        </li>
      ))}
    </ul>
  )
}
