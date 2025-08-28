// resources/js/Components/Pagination.jsx
import React from 'react'

export default function Pagination({ links, onPageChange }) {
  if (!links || links.length === 0) return null

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      {links.map((link, index) => {
        let label = link.label

        // Substitui "Previous" e "Next" por setas
        if (/Previous/i.test(label)) label = '←'
        if (/Next/i.test(label)) label = '→'

        return (
          <button
            key={index}
            disabled={!link.url}
            onClick={() =>
              link.url && onPageChange(new URL(link.url).searchParams.get('page'))
            }
            className={`px-3 py-1 rounded ${
              link.active
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
            dangerouslySetInnerHTML={{ __html: label }}
          />
        )
      })}
    </div>
  )
}
