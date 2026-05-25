export interface NewsArticle {
  title: string
  description: string | null
  url: string
  publishedAt: string
  source: string
}

export interface NewsResponse {
  articles: NewsArticle[]
  fetchedAt: string
  error?: string
}

const SEARCH_QUERY = [
  '"peptide therapy"',
  '"peptide research"',
  'semaglutide',
  'tirzepatide',
  '"GLP-1"',
  '"BPC-157"',
  '"TB-500"',
  '"nootropic peptide"',
].join(' OR ')

const RSS_URL =
  `https://news.google.com/rss/search?q=${encodeURIComponent(SEARCH_QUERY)}&hl=en-US&gl=US&ceid=US:en`

function extractCdata(raw: string): string {
  const m = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)
  return m ? m[1].trim() : raw.trim()
}

function extractTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return m ? extractCdata(m[1]) : ''
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, 'i'))
  return m ? m[1] : ''
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim()
}

function parseRss(xml: string): NewsArticle[] {
  const items = xml.match(/<item>([\s\S]*?)<\/item>/gi) ?? []

  return items.map((item) => {
    const rawTitle = extractTag(item, 'title')
    // Google News appends " - Source Name" to every title
    const sourceFromTitle = rawTitle.match(/ - ([^-]+)$/)
    const title = sourceFromTitle
      ? rawTitle.slice(0, rawTitle.lastIndexOf(` - ${sourceFromTitle[1]}`)).trim()
      : rawTitle

    const sourceName =
      extractTag(item, 'source') ||
      (sourceFromTitle ? sourceFromTitle[1].trim() : 'Unknown')

    const link = extractTag(item, 'link') || extractAttr(item, 'guid', 'isPermaLink') === 'false'
      ? extractTag(item, 'link')
      : extractTag(item, 'guid')

    const pubDate = extractTag(item, 'pubDate')
    const rawDesc = extractTag(item, 'description')
    const description = rawDesc ? stripHtml(rawDesc) : null

    return {
      title,
      description: description || null,
      url: link,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      source: sourceName,
    }
  }).filter((a) => a.title && a.url)
}

export async function fetchPeptideNews(): Promise<NewsResponse> {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 1800 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PeptideDB/1.0; RSS reader)' },
    })

    if (!res.ok) {
      return {
        articles: [],
        fetchedAt: new Date().toISOString(),
        error: `Google News returned ${res.status}`,
      }
    }

    const xml = await res.text()
    const articles = parseRss(xml).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )

    return { articles, fetchedAt: new Date().toISOString() }
  } catch (err) {
    return {
      articles: [],
      fetchedAt: new Date().toISOString(),
      error: err instanceof Error ? err.message : 'Network error',
    }
  }
}
