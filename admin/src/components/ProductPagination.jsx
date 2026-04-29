import React from 'react'

const ProductPagination = ({ page, totalPages, onPageChange, className = '' }) => {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, page - 2)
    let endPage = Math.min(totalPages, page + 2)

    if (endPage - startPage < maxVisible - 1) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisible - 1)
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisible + 1)
      }
    }

    if (startPage > 1) pages.push(1)
    if (startPage > 2) pages.push('...')
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    if (endPage < totalPages - 1) pages.push('...')
    if (endPage < totalPages) pages.push(totalPages)

    return pages
  }

  const pages = getPageNumbers()

  return (
    <div className={`flex items-center justify-between p-6 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200 rounded-b-3xl shadow-lg ${className}`}>
      <div className="text-sm text-slate-600 font-medium">
        Page <span className="font-bold text-slate-900">{page}</span> of <span className="font-bold text-slate-900">{totalPages}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="group flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-2xl border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 min-w-[120px]"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <div className="flex items-center gap-1.5">
          {pages.map((pageNum, index) => (
            pageNum !== '...' ? (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-11 h-11 rounded-xl text-sm font-bold flex items-center justify-center shadow-md transition-all duration-200 border-2 hover:shadow-lg hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  pageNum === page
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-400/50 border-transparent ring-2 ring-indigo-500/50'
                    : 'text-slate-700 hover:bg-slate-100 border-slate-200 hover:border-slate-300 hover:text-slate-900 bg-white shadow-sm'
                }`}
              >
                {pageNum}
              </button>
            ) : (
              <span key={`dot-${index}`} className="px-3 text-slate-400 font-mono text-sm">...</span>
            )
          ))}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="group flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-2xl border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 min-w-[120px]"
        >
          Next
          <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ProductPagination

