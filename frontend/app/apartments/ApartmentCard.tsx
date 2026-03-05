'use client'

import { useState } from 'react'
import Image from 'next/image'
import { addToFavorites, removeFromFavorites } from './actions'
import ApartmentUnitsList from './ApartmentUnitsList'

interface ApartmentCardProps {
  apartment: {
    id: string
    name: string
    image_url?: string | null
  }
  initialIsStarred: boolean
  isInCompare: boolean
  compareKeys: string[]
}

export default function ApartmentCard({
  apartment,
  initialIsStarred,
  isInCompare,
  compareKeys,
}: ApartmentCardProps) {
  const [isStarred, setIsStarred] = useState(initialIsStarred)
  const [expanded, setExpanded] = useState(false)

  const toggleStarred = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const newState = !isStarred
    setIsStarred(newState)
    try {
      if (newState) {
        await addToFavorites(apartment.id)
      } else {
        await removeFromFavorites(apartment.id)
      }
    } catch (error) {
      setIsStarred(!newState)
      console.error('Error toggling favorite:', error)
    }
  }

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 ${
        expanded ? 'shadow-md ring-2 ring-zinc-200' : 'hover:shadow-md hover:border-zinc-300'
      }`}
    >
      {/* Image */}
        <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="group relative block w-full overflow-hidden bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
        aria-expanded={expanded}
      >
        <div className="aspect-[16/10] w-full">
          {apartment.image_url ? (
            <Image
              src={apartment.image_url}
              alt={apartment.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          )}
        </div>
        {/* Badges overlay */}
        <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
          {(isInCompare || isStarred) && (
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              {isInCompare && (
                <span className="inline-flex items-center justify-center rounded-full bg-amber-500/95 px-2.5 py-1 text-xs font-medium leading-none text-white shadow-sm">
                  In compare
                </span>
              )}
              <button
                type="button"
                onClick={toggleStarred}
                className="rounded-full p-1.5 shadow-sm transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label={isStarred ? 'Unstar apartment' : 'Star apartment'}
              >
                {isStarred ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-amber-400 drop-shadow-sm"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5 text-white drop-shadow-md"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}
          {!isStarred && !isInCompare && (
            <button
              type="button"
              onClick={toggleStarred}
              className="rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur-sm transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              aria-label="Star apartment"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-zinc-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </button>
          )}
        </div>
      </button>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 rounded-lg -m-2 p-2"
          aria-expanded={expanded}
        >
          <h2 className="text-lg font-semibold text-zinc-900">{apartment.name}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
            {expanded ? (
              <>
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-zinc-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
                  </svg>
                </span>
                Hide units
              </>
            ) : (
              <>
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-zinc-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </span>
                View units
              </>
            )}
          </p>
        </button>
      </div>

      {expanded && (
        <ApartmentUnitsList
          apartmentId={apartment.id}
          apartmentName={apartment.name}
          compareKeys={compareKeys}
        />
      )}
    </article>
  )
}
