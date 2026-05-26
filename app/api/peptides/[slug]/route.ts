import { NextRequest, NextResponse } from 'next/server'
import { getPeptideBySlug } from '@/lib/peptides'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const result = getPeptideBySlug(params.slug)

  if (!result) {
    return NextResponse.json(
      { error: `Peptide '${params.slug}' not found` },
      { status: 404, headers: CORS },
    )
  }

  return NextResponse.json(
    { data: { ...result.frontmatter, content: result.content.trim() } },
    { headers: CORS },
  )
}
