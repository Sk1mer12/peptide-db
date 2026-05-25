import { Newspaper, RefreshCw, AlertCircle, Clock } from 'lucide-react'
import { fetchPeptideNews } from '@/lib/news'
import NewsCard from '@/components/news/NewsCard'
import type { Metadata } from 'next'

export const revalidate = 1800 // revalidate every 30 minutes

export const metadata: Metadata = {
  title: 'Peptide News — PeptideDB',
  description:
    'Latest research news and clinical updates on peptides, including GLP-1 agonists, neuropeptides, and investigational compounds.',
}

export default async function NewsPage() {
  const { articles, fetchedAt, error } = await fetchPeptideNews()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Newspaper size={24} className="text-blue-600" />
            Peptide News
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Latest research, clinical trials, and industry news — sourced from Google News.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
          <Clock size={12} />
          <span>
            Updated{' '}
            {new Date(fetchedAt).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <RefreshCw size={11} className="ml-1" />
          <span>30 min</span>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-sm">
          <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Could not load news</p>
            <p className="text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {!error && articles.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Newspaper size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No articles found right now. Check back shortly.</p>
        </div>
      )}

      {articles.length > 0 && (
        <>
          <p className="text-xs text-gray-400 mb-4">{articles.length} articles</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {articles.map((article) => (
              <NewsCard key={article.url} article={article} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
