'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { btn } from '@/lib/button-styles'
import { copyText } from '@/lib/clipboard'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'copied' | 'failed'

export function PromptTextPanel({ promptText }: { promptText: string }) {
  const [status, setStatus] = useState<Status>('idle')
  const textRef = useRef<HTMLPreElement>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function onCopy() {
    const ok = await copyText(promptText)
    if (!ok && textRef.current) {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(textRef.current)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
    setStatus(ok ? 'copied' : 'failed')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <section aria-labelledby="prompt-heading" className="rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <h2 id="prompt-heading" className="text-base font-semibold">
          Full prompt
        </h2>
        <button
          type="button"
          onClick={onCopy}
          className={cn(
            btn({ size: 'md', variant: status === 'copied' ? 'secondary' : 'primary' }),
            'min-w-[9.5rem]',
          )}
        >
          {status === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {status === 'copied' ? 'Prompt copied!' : 'Copy Prompt'}
        </button>
      </div>
      <pre
        ref={textRef}
        className="whitespace-pre-wrap break-words px-4 py-4 font-sans text-[15px] leading-7 text-foreground sm:px-5"
      >
        {promptText}
      </pre>
      <p role="status" aria-live="polite" className="min-h-0 px-4 pb-4 text-sm sm:px-5">
        {status === 'copied' ? <span className="text-success">Prompt copied to your clipboard.</span> : null}
        {status === 'failed' ? (
          <span className="text-destructive">
            Couldn&apos;t access the clipboard. The prompt is selected, so press Ctrl+C (or Cmd+C) to copy it.
          </span>
        ) : null}
      </p>
    </section>
  )
}
