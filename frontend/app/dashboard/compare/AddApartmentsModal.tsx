'use client'

import { useEffect, useState } from 'react'
import { getApartments } from './actions'

interface Apartment {
  id: string
  name: string
}

interface AddApartmentsModalProps {
  isOpen: boolean
  onClose: () => void
  existingFavoriteIds: Set<string>
  onSelectApartments: (apartmentIds: string[], apartmentNames: Map<string, string>) => void
}

export default function AddApartmentsModal({
  isOpen,
  onClose,
  existingFavoriteIds,
  onSelectApartments,
}: AddApartmentsModalProps) {
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-open requires immediate loading state */
      setLoading(true)
      setError(null)
      setSelectedIds(new Set())
      getApartments()
        .then(setApartments)
        .catch(() => setError('Failed to load apartments'))
        .finally(() => setLoading(false))
    }
  }, [isOpen])

  const toggleSelection = (id: string) => {
    if (existingFavoriteIds.has(id)) return
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSubmit = () => {
    const toAdd = [...selectedIds].filter((id) => !existingFavoriteIds.has(id))
    if (toAdd.length === 0) {
      onClose()
      return
    }
    const apartmentNames = new Map(apartments.map((a) => [a.id, a.name]))
    onSelectApartments(toAdd, apartmentNames)
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-apartments-title"
    >
      <div
        className="w-full max-w-md rounded-lg border border-zinc-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <h2 id="add-apartments-title" className="text-lg font-semibold text-zinc-900">
            Add apartments to compare
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8 text-zinc-500">Loading apartments…</div>
          ) : error ? (
            <div className="py-4 text-center text-sm text-red-600">{error}</div>
          ) : apartments.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-500">No apartments found.</div>
          ) : (
            <ul className="space-y-1">
              {apartments.map((apt) => {
                const isAlreadyFavorite = existingFavoriteIds.has(apt.id)
                const isSelected = selectedIds.has(apt.id)
                return (
                  <li key={apt.id}>
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                        isAlreadyFavorite
                          ? 'cursor-not-allowed bg-zinc-50 text-zinc-400'
                          : isSelected
                            ? 'bg-zinc-100'
                            : 'hover:bg-zinc-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected || isAlreadyFavorite}
                        disabled={isAlreadyFavorite}
                        onChange={() => toggleSelection(apt.id)}
                        className="h-4 w-4 rounded border-zinc-300 text-zinc-800 focus:ring-zinc-500"
                      />
                      <span className="text-sm font-medium text-zinc-800">{apt.name}</span>
                      {isAlreadyFavorite && (
                        <span className="ml-auto text-xs text-zinc-400">Already added</span>
                      )}
                    </label>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-zinc-200 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedIds.size === 0}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next: Select units ({selectedIds.size})
          </button>
        </div>
      </div>
    </div>
  )
}
