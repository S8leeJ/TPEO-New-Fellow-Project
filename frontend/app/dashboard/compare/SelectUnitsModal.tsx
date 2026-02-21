'use client'

import { useEffect, useState } from 'react'
import { getUnitsByApartmentIds, type UnitWithApartment } from './actions'

interface SelectUnitsModalProps {
  isOpen: boolean
  onClose: () => void
  apartmentIds: string[]
  apartmentNames: Map<string, string>
  existingCompareKeys: Set<string>
  onAddUnit: (apartmentId: string, unitId: string) => Promise<void>
}

function unitKey(apartmentId: string, unitId: string) {
  return `${apartmentId}:${unitId}`
}

export default function SelectUnitsModal({
  isOpen,
  onClose,
  apartmentIds,
  apartmentNames,
  existingCompareKeys,
  onAddUnit,
}: SelectUnitsModalProps) {
  const [units, setUnits] = useState<UnitWithApartment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addingId, setAddingId] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && apartmentIds.length > 0) {
      setLoading(true)
      setError(null)
      getUnitsByApartmentIds(apartmentIds)
        .then(setUnits)
        .catch(() => setError('Failed to load units'))
        .finally(() => setLoading(false))
    } else {
      setUnits([])
    }
  }, [isOpen, apartmentIds.join(',')])

  const handleAddUnit = async (unit: UnitWithApartment) => {
    const key = unitKey(unit.apartment_id, unit.id)
    if (existingCompareKeys.has(key)) return

    setAddingId(unit.id)
    setError(null)
    try {
      await onAddUnit(unit.apartment_id, unit.id)
    } catch {
      setError('Failed to add unit')
    } finally {
      setAddingId(null)
    }
  }

  const formatUnitInfo = (unit: UnitWithApartment) => {
    const parts: string[] = []
    if (unit.bedrooms != null) parts.push(`${unit.bedrooms} bed`)
    if (unit.bathrooms != null) parts.push(`${unit.bathrooms} bath`)
    if (unit.sq_ft != null) parts.push(`${unit.sq_ft} sqft`)
    if (unit.floor != null) parts.push(`Floor ${unit.floor}`)
    if (unit.windows != null) parts.push(unit.windows)
    return parts.length > 0 ? parts.join(' · ') : unit.room_type
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  const unitsByApartment = units.reduce<Record<string, UnitWithApartment[]>>((acc, u) => {
    const aid = u.apartment_id
    if (!acc[aid]) acc[aid] = []
    acc[aid].push(u)
    return acc
  }, {})

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="select-units-title"
    >
      <div
        className="w-full max-w-lg rounded-lg border border-zinc-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <h2 id="select-units-title" className="text-lg font-semibold text-zinc-900">
            Select a unit to add
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

        <div className="max-h-96 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8 text-zinc-500">Loading units…</div>
          ) : error ? (
            <div className="py-4 text-center text-sm text-red-600">{error}</div>
          ) : units.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-500">
              No units found for the selected apartments. Units may need to be added to the database.
            </div>
          ) : (
            <div className="space-y-6">
              {apartmentIds.map((aptId) => {
                const aptUnits = unitsByApartment[aptId] ?? []
                const aptName = apartmentNames.get(aptId) ?? 'Unknown'
                if (aptUnits.length === 0) return null

                return (
                  <div key={aptId}>
                    <h3 className="mb-2 text-sm font-medium text-zinc-700">{aptName}</h3>
                    <ul className="space-y-1">
                      {aptUnits.map((unit) => {
                        const key = unitKey(unit.apartment_id, unit.id)
                        const isAlreadyAdded = existingCompareKeys.has(key)
                        const isAdding = addingId === unit.id

                        return (
                          <li key={unit.id}>
                            <button
                              type="button"
                              onClick={() => handleAddUnit(unit)}
                              disabled={isAlreadyAdded || isAdding}
                              className={`flex w-full flex-col items-start rounded-lg px-3 py-2.5 text-left transition-colors ${
                                isAlreadyAdded
                                  ? 'cursor-not-allowed bg-zinc-50 text-zinc-400'
                                  : 'hover:bg-zinc-100'
                              }`}
                            >
                              <span className="text-sm font-medium text-zinc-900">
                                {unit.room_type}
                              </span>
                              <span className="text-xs text-zinc-500">
                                {formatUnitInfo(unit)}
                              </span>
                              {isAlreadyAdded && (
                                <span className="mt-1 text-xs text-zinc-400">Already in compare</span>
                              )}
                              {isAdding && (
                                <span className="mt-1 text-xs text-zinc-500">Adding…</span>
                              )}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-t border-zinc-200 px-4 py-3">
          <p className="text-center text-xs text-zinc-500">
            Click a unit to add it to the compare page
          </p>
        </div>
      </div>
    </div>
  )
}
