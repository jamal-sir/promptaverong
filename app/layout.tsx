import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Inter_Tight } from 'next/font/google'
import { JsonLd } from '@/components/json-ld'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { ThemeProvider } from '@/components/theme-provider'
import { siteConfig } from '@/data/site-config'
import { categories, getAllTags } from '@/lib/content'
import { websiteJsonLd } from '@/lib/seo'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-inter-tight', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Premium AI Image Prompt Library`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: 'en_US',
    title: `${siteConfig.name} — Premium AI Image Prompt Library`,
    description: siteConfig.description,
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/icon.svg' },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F9FC' },
    { media: '(prefers-color-scheme: dark)', color: '#0E0F16' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const headerCategories = categories.map(({ name, slug }) => ({ name, slug }))
  const headerTags = getAllTags()
    .slice(0, 8)
    .map(({ slug, label }) => ({ slug, label }))

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${interTight.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <SiteHeader categories={headerCategories} tags={headerTags} />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <JsonLd data={websiteJsonLd()} />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
