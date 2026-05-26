import { NextRequest, NextResponse } from 'next/server'
import { getAllPeptides } from '@/lib/peptides'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const category = searchParams.get('category') ?? ''
  const purpose = searchParams.get('purpose') ?? ''
  const q = (searchParams.get('q') ?? '').toLowerCase().trim()
  const sportsBan = searchParams.get('sportsBan')
  const requiresRx = searchParams.get('requiresRx')
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') ?? '50', 10) || 50, 1), 200)
  const offset = Math.max(parseInt(searchParams.get('offset') ?? '0', 10) || 0, 0)

  const valid_categories = ['approved-rx', 'investigational', 'grey-market']
  if (category && !valid_categories.includes(category)) {
    return NextResponse.json(
      { error: `Invalid category. Must be one of: ${valid_categories.join(', ')}` },
      { status: 400, headers: CORS },
    )
  }

  let peptides = getAllPeptides()

  if (category) {
    peptides = peptides.filter(p => p.category === category)
  }

  if (purpose) {
    const purposes = purpose.split(',').map(s => s.trim()).filter(Boolean)
    peptides = peptides.filter(p => purposes.some(pur => p.purpose.includes(pur)))
  }

  if (sportsBan !== null) {
    const ban = sportsBan === 'true'
    peptides = peptides.filter(p => p.sportsBan === ban)
  }

  if (requiresRx !== null) {
    const rx = requiresRx === 'true'
    peptides = peptides.filter(p => p.requiresRx === rx)
  }

  if (q) {
    peptides = peptides.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.aliases.some(a => a.toLowerCase().includes(q)) ||
      p.summary.toLowerCase().includes(q) ||
      p.brands.some(b => b.toLowerCase().includes(q)),
    )
  }

  const total = peptides.length
  const page = peptides.slice(offset, offset + limit)

  return NextResponse.json(
    {
      data: page,
      meta: {
        total,
        count: page.length,
        limit,
        offset,
        ...(offset + limit < total ? { nextOffset: offset + limit } : {}),
      },
    },
    { headers: CORS },
  )
}
