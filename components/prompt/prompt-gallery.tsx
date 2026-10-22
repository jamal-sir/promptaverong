'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Download, Maximize2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { btn } from '@/lib/button-styles'
import { cn } from '@/lib/utils'
import type { PromptImage } from '@/types/content'

function extensionOf(src: string) {
  const match = /\.([a-z0-9]+)(?:\?|$)/i.exec(src)
  return match ? match[1].toLowerCase() : 'webp'
}

export function PromptGallery({
  slug,
  title,
  images,
}: {
  slug: string
  title: string
  images: PromptImage[]
}) {
  const [selected, setSelected] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const current = images[selected]

  async function download(index: number) {
    const image = images[index]
    setError('')
    setBusy(true)
    try {
      const response = await fetch(image.src)
      if (!response.ok) throw new Error(`Request failed with ${response.status}`)
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = `${slug}-${index + 1}.${extensionOf(image.src)}`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
    } catch {
      setError('The image couldn’t be downloaded. Please check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
        <div
          className="mx-auto w-full"
          style={{ aspectRatio: `${current.width} / ${current.height}`, maxHeight: '78vh' }}
        >
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority={selected === 0}
            className="size-full object-contain"
          />
        </div>
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          aria-label="View image fullscreen"
          className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-xl bg-background/90 text-foreground shadow-sm backdrop-blur hover:bg-background"
        >
          <Maximize2 className="size-4" aria-hidden="true" />
        </button>
        {images.length > 1 ? (
          <p className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
            Variation {selected + 1} of {images.length}
          </p>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="mt-3 grid grid-cols-5 gap-2" aria-label="Image variations">
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-label={`Show variation ${index + 1}`}
                aria-current={index === selected}
                className={cn(
                  'relative block w-full overflow-hidden rounded-xl border-2 bg-muted transition-all duration-200',
                  index === selected
                    ? 'border-primary'
                    : 'border-transparent opacity-70 hover:opacity-100',
                )}
              >
                <Image
                  src={image.src}
                  alt=""
                  width={image.width}
                  height={image.height}
                  sizes="96px"
                  loading="lazy"
                  className="aspect-[3/4] size-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => download(selected)}
          disabled={busy}
          className={btn({ variant: 'secondary', size: 'md' })}
        >
          <Download aria-hidden="true" />
          {busy ? 'Preparing…' : 'Download Image'}
        </button>
        {images.length > 1 ? (
          <details className="group relative">
            <summary className="inline-flex h-10 cursor-pointer list-none items-center rounded-xl px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&::-webkit-details-marker]:hidden">
              All variations
            </summary>
            <ul className="absolute left-0 z-10 mt-1 w-56 rounded-xl border border-border bg-popover p-1.5 shadow-lg">
              {images.map((image, index) => (
                <li key={image.src}>
                  <button
                    type="button"
                    onClick={() => download(index)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    Variation {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </div>
      <p role="alert" className="mt-2 min-h-0 text-sm text-destructive">
        {error}
      </p>

      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-[96vw] gap-0 bg-black p-2 sm:max-w-3xl">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">{current.alt}</DialogDescription>
          <Image
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            sizes="96vw"
            className="mx-auto max-h-[88vh] w-auto rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
