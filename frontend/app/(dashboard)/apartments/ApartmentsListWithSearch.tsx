'use client'

import { useState, useMemo, useEffect, useTransition, useCallback } from 'react'
import ApartmentCard from '@/app/apartments/ApartmentCard'
import ApartmentDetailModal from '@/app/apartments/ApartmentDetailModal'
import {
  addFavorite,
  removeFavorite,
  getApartments,
  getCompareItems,
  getFavoriteApartmentIds,
} from '@/lib/cached-actions'
import type { ApartmentForCompare } from '@/app/(dashboard)/compare/actions'
import type { CompareItemWithDetails } from '@/app/(dashboard)/compare/actions'

function compareKey(apartmentId: string, unitId: string) {
  return `${apartmentId}:${unitId}`
}

export default function ApartmentsListWithSearch() {
  const [apartments, setApartments] = useState<ApartmentForCompare[]>([])
  const [compareItems, setCompareItems] = useState<CompareItemWithDetails[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [selectedApartment, setSelectedApartment] = useState<ApartmentForCompare | null>(null)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [, startTransition] = useTransition()

  const fetchData = useCallback(async () => {
    const [apts, items, favIds] = await Promise.all([
      getApartments(),
      getCompareItems(),
      getFavoriteApartmentIds(),
    ])
    setApartments(apts)
    setCompareItems(items)
    setFavoriteIds(favIds)
  }, [])

  useEffect(() => {
    fetchData().finally(() => setLoading(false))
  }, [fetchData])

  const handleToggleFavorite = (apartmentId: string, isFavorited: boolean) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (isFavorited) {
        next.delete(apartmentId)
      } else {
        next.add(apartmentId)
      }
      return next
    })

    startTransition(async () => {
      try {
        if (isFavorited) {
          await removeFavorite(apartmentId)
        } else {
          await addFavorite(apartmentId)
        }
      } catch {
        setFavoriteIds((prev) => {
          const reverted = new Set(prev)
          if (isFavorited) {
            reverted.add(apartmentId)
          } else {
            reverted.delete(apartmentId)
          }
          return reverted
        })
      }
    })
  }

  const apartmentIdsInCompare = useMemo(
    () => new Set(compareItems.map((c) => c.apartment_id)),
    [compareItems],
  )
  const compareKeys = useMemo(
    () => compareItems.map((c) => compareKey(c.apartment_id, c.unit_id)),
    [compareItems],
  )

  const filteredApartments = useMemo(() => {
    let list = apartments
    if (showFavoritesOnly) {
      list = list.filter((a) => favoriteIds.has(a.id))
    }
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((a) => a.name.toLowerCase().includes(q))
    }
    return list
  }, [apartments, search, showFavoritesOnly, favoriteIds])

  const favCount = favoriteIds.size

  if (loading) {
    return (
      <>
        <div className="mb-6 flex items-center gap-3">
          <div className="h-11 w-full max-w-md animate-pulse rounded-xl bg-zinc-200" />
          <div className="h-11 w-32 shrink-0 animate-pulse rounded-xl bg-zinc-200" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white"
            >
              <div className="aspect-[16/10] w-full animate-pulse bg-zinc-200" />
              <div className="p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200" />
                <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-zinc-200" />
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <ApartmentDetailModal
        isOpen={selectedApartment != null}
        onClose={() => setSelectedApartment(null)}
        apartment={selectedApartment}
        compareKeys={compareKeys}
      />

      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="apartment-search" className="sr-only">
          Search apartments
        </label>
        <input
          id="apartment-search"
          type="search"
          placeholder="Search apartments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-xl border border-zinc-900 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          aria-describedby={search ? 'search-results' : undefined}
        />
        <button
          type="button"
          onClick={() => setShowFavoritesOnly((prev) => !prev)}
          className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
            showFavoritesOnly
              ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
              : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50'
          }`}
          aria-pressed={showFavoritesOnly}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={showFavoritesOnly ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={showFavoritesOnly ? 0 : 1.5}
            className={`h-4 w-4 ${showFavoritesOnly ? 'text-amber-400' : 'text-zinc-400'}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
          Favorites{favCount > 0 ? ` (${favCount})` : ''}
        </button>
        {search && (
          <p id="search-results" className="text-sm text-zinc-500">
            {filteredApartments.length === 0
              ? 'No apartments match your search.'
              : `Showing ${filteredApartments.length} of ${apartments.length}`}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filteredApartments.map((apartment) => (
          <ApartmentCard
            key={apartment.id}
            apartment={apartment}
            isInCompare={apartmentIdsInCompare.has(apartment.id)}
            isFavorited={favoriteIds.has(apartment.id)}
            onOpen={setSelectedApartment}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>

      {filteredApartments.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white py-16 text-center">
          <p className="text-zinc-500">
            {showFavoritesOnly && favCount === 0
              ? 'No favorite apartments yet.'
              : apartments.length === 0
                ? 'No apartments found.'
                : 'No apartments match your search.'}
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            {showFavoritesOnly && favCount === 0
              ? 'Star an apartment to add it to your favorites.'
              : apartments.length === 0
                ? 'Add apartments in the dashboard to see them here.'
                : 'Try a different search term.'}
          </p>
        </div>
      )}
    </>
  )
}
