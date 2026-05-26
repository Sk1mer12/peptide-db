export const metadata = {
  title: 'API Reference — PeptideDB',
  description: 'REST API for accessing the PeptideDB compound database.',
}

function Code({ children }: { children: string }) {
  return (
    <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  )
}

function Block({ children }: { children: string }) {
  return (
    <pre className="bg-gray-950 text-gray-100 rounded-lg p-4 text-sm font-mono overflow-x-auto whitespace-pre">
      {children}
    </pre>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">{title}</h2>
      {children}
    </section>
  )
}

function Param({ name, type, description }: { name: string; type: string; description: string }) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-2 pr-4 font-mono text-sm text-indigo-700 whitespace-nowrap">{name}</td>
      <td className="py-2 pr-4 text-xs text-gray-500 whitespace-nowrap">{type}</td>
      <td className="py-2 text-sm text-gray-600">{description}</td>
    </tr>
  )
}

export default function ApiDocsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900">API Reference</h1>
        <p className="text-sm text-gray-500 mt-2">
          Read-only JSON API. No authentication required. All responses include CORS headers.
        </p>
      </div>

      <Section title="Base URL">
        <Block>{`https://peptide-db.vercel.app/api`}</Block>
      </Section>

      <Section title="GET /api/peptides">
        <p className="text-sm text-gray-600 mb-4">
          Returns a paginated list of compounds. All query parameters are optional and combinable.
        </p>
        <table className="w-full text-left mb-6">
          <thead>
            <tr className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              <th className="pb-2 pr-4">Parameter</th>
              <th className="pb-2 pr-4">Type</th>
              <th className="pb-2">Description</th>
            </tr>
          </thead>
          <tbody>
            <Param name="category" type="string" description="Filter by category: approved-rx · investigational · grey-market" />
            <Param name="purpose" type="string" description="Comma-separated purposes e.g. weight-loss,healing. Matches any." />
            <Param name="q" type="string" description="Full-text search across name, aliases, brands, and summary." />
            <Param name="sportsBan" type="boolean" description="true or false — filter by WADA prohibition status." />
            <Param name="requiresRx" type="boolean" description="true or false — filter by prescription requirement." />
            <Param name="limit" type="integer" description="Results per page. Default 50, max 200." />
            <Param name="offset" type="integer" description="Pagination offset. Default 0." />
          </tbody>
        </table>

        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Examples</p>
        <div className="flex flex-col gap-2 mb-4">
          {[
            '/api/peptides',
            '/api/peptides?category=approved-rx',
            '/api/peptides?purpose=weight-loss,gut-health',
            '/api/peptides?q=semaglutide',
            '/api/peptides?sportsBan=true&limit=20&offset=0',
          ].map(url => (
            <a
              key={url}
              href={url}
              target="_blank"
              className="font-mono text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              {url}
            </a>
          ))}
        </div>

        <Block>{`{
  "data": [
    {
      "name": "Semaglutide",
      "slug": "semaglutide",
      "category": "approved-rx",
      "status": "FDA Approved",
      "aliases": ["Ozempic", "Wegovy", "Rybelsus"],
      "purpose": ["weight-loss", "diabetes", "cardiovascular"],
      "route": "Subcutaneous injection (Ozempic/Wegovy) / oral tablet (Rybelsus)",
      "halfLife": "~1 week",
      "molecularWeight": "4113.58 g/mol",
      "safetyRating": 4,
      "performanceRating": 5,
      "requiresRx": true,
      "sportsBan": false,
      "brands": ["Ozempic", "Wegovy", "Rybelsus"],
      "summary": "...",
      ...
    }
  ],
  "meta": {
    "total": 115,
    "count": 50,
    "limit": 50,
    "offset": 0,
    "nextOffset": 50
  }
}`}
        </Block>
      </Section>

      <Section title="GET /api/peptides/:slug">
        <p className="text-sm text-gray-600 mb-4">
          Returns the full record for a single compound including its markdown body content.
        </p>

        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Example</p>
        <div className="mb-4">
          <a
            href="/api/peptides/semaglutide"
            target="_blank"
            className="font-mono text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            /api/peptides/semaglutide
          </a>
        </div>

        <Block>{`{
  "data": {
    "name": "Semaglutide",
    "slug": "semaglutide",
    "category": "approved-rx",
    "content": "## Mechanism\\n\\nSemaglutide is a ...",
    ...all frontmatter fields...
  }
}`}
        </Block>

        <p className="text-sm text-gray-600 mt-4">
          Returns <Code>404</Code> with <Code>{`{ "error": "Peptide 'slug' not found" }`}</Code> for unknown slugs.
        </p>
      </Section>

      <Section title="Available purpose values">
        <div className="flex flex-wrap gap-2">
          {[
            'weight-loss','diabetes','cardiovascular','gh-release','healing',
            'nootropic','cancer','sexual-health','anti-aging','immune',
            'hormonal','osteoporosis','gut-health','neuroprotection',
            'skin-hair','antimicrobial','muscle-recovery','longevity',
          ].map(p => (
            <Code key={p}>{p}</Code>
          ))}
        </div>
      </Section>

      <Section title="Notes">
        <ul className="text-sm text-gray-600 flex flex-col gap-2 list-disc list-inside">
          <li>All endpoints are read-only. No API key required.</li>
          <li>Responses include <Code>Access-Control-Allow-Origin: *</Code> — safe to call from any browser or server.</li>
          <li>Data is for educational and research reference only. See individual compound records for legal and safety notes.</li>
          <li>The <Code>content</Code> field returned by <Code>/api/peptides/:slug</Code> is raw Markdown.</li>
        </ul>
      </Section>
    </div>
  )
}
