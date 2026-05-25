export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500 max-w-3xl leading-relaxed">
          <strong>Disclaimer:</strong> PeptideDB is an educational reference database only. Information provided does
          not constitute medical advice and should not be used to self-diagnose or self-treat. Many compounds listed
          are not approved for human use by the FDA or equivalent regulatory bodies. Always consult a licensed
          healthcare professional before using any peptide or pharmaceutical compound.
        </p>
        <p className="text-xs text-gray-400 mt-3">© {new Date().getFullYear()} PeptideDB · For research and educational purposes only</p>
      </div>
    </footer>
  )
}
