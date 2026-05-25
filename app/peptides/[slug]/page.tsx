import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { compileMDX } from 'next-mdx-remote/rsc'
import { getAllSlugs, getPeptideBySlug } from '@/lib/peptides'
import type { PeptideFrontmatter } from '@/types'
import PeptideDetailHeader from '@/components/peptides/PeptideDetailHeader'
import PeptideMetaTable from '@/components/peptides/PeptideMetaTable'
import StatusBanner from '@/components/peptides/StatusBanner'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const result = getPeptideBySlug(params.slug)
  if (!result) return {}
  return {
    title: `${result.frontmatter.name} — PeptideDB`,
    description: result.frontmatter.summary,
  }
}

export default async function PeptideDetailPage({ params }: Props) {
  const result = getPeptideBySlug(params.slug)
  if (!result) notFound()

  const { frontmatter, content } = result

  const { content: mdxContent } = await compileMDX<PeptideFrontmatter>({
    source: content || '_No additional information available._',
    options: { parseFrontmatter: false },
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/peptides"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Back to Database
      </Link>
      <StatusBanner category={frontmatter.category} />
      <div className={frontmatter.category !== 'approved-rx' ? 'mt-4' : ''}>
        <PeptideDetailHeader peptide={frontmatter} />
        <PeptideMetaTable peptide={frontmatter} />
        {content.trim() && (
          <div className="prose prose-gray max-w-none mt-8">
            {mdxContent}
          </div>
        )}
      </div>
    </div>
  )
}
