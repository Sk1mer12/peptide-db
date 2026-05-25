'use client'

import { ExternalLink, Calendar } from 'lucide-react'
import type { NewsArticle } from '@/lib/news'

interface Props {
  article: NewsArticle
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1) return 'just now'
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return formatDate(iso)
}

export default function NewsCard({ article }: Props) {
  return (
    <article className="bg-white border border-gray-200 rounded-lg flex flex-col hover:border-gray-300 hover:shadow-sm transition-all p-4 gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded truncate max-w-[65%]">
          {article.source}
        </span>
        <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
          <Calendar size={11} />
          {timeAgo(article.publishedAt)}
        </span>
      </div>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-gray-900 leading-snug hover:text-blue-600 transition-colors line-clamp-3 text-sm flex-1"
      >
        {article.title}
      </a>

      {article.description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
          {article.description}
        </p>
      )}

      <div className="pt-2 border-t border-gray-100">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium w-fit"
        >
          Read full article <ExternalLink size={11} />
        </a>
      </div>
    </article>
  )
}
