'use client'

import { cachedFetch, invalidate } from './client-cache'
import {
  getApartments as _getApartments,
  getUnitsByApartmentIds as _getUnitsByApartmentIds,
  getCompareItems as _getCompareItems,
  addToCompare as _addToCompare,
  removeFromCompare as _removeFromCompare,
} from '@/app/(dashboard)/compare/actions'
import {
  getFavoriteApartmentIds as _getFavoriteApartmentIds,
  addFavorite as _addFavorite,
  removeFavorite as _removeFavorite,
} from '@/app/apartments/actions'

const TTL = {
  apartments: 5 * 60_000,  // 5 min — rarely changes
  units: 5 * 60_000,       // 5 min — rarely changes
  favorites: 2 * 60_000,   // 2 min — changes on user action, but also invalidated eagerly
  compare: 2 * 60_000,     // 2 min — same
} as const

export const CACHE_KEYS = {
  apartments: 'apartments',
  units: (ids: string[]) => `units:${[...ids].sort().join(',')}`,
  favorites: 'favorites',
  compare: 'compare-items',
} as const

// ── Read actions (cached) ──────────────────────────────────────────

export function getApartments() {
  return cachedFetch(CACHE_KEYS.apartments, _getApartments, TTL.apartments)
}

export function getUnitsByApartmentIds(apartmentIds: string[]) {
  return cachedFetch(
    CACHE_KEYS.units(apartmentIds),
    () => _getUnitsByApartmentIds(apartmentIds),
    TTL.units,
  )
}

export async function getFavoriteApartmentIds() {
  const arr = await cachedFetch(
    CACHE_KEYS.favorites,
    async () => [...(await _getFavoriteApartmentIds())],
    TTL.favorites,
  )
  return new Set(arr)
}

export function getCompareItems() {
  return cachedFetch(CACHE_KEYS.compare, _getCompareItems, TTL.compare)
}

// ── Write actions (pass-through + invalidate) ──────────────────────

export async function addFavorite(apartmentId: string) {
  await _addFavorite(apartmentId)
  invalidate(CACHE_KEYS.favorites)
}

export async function removeFavorite(apartmentId: string) {
  await _removeFavorite(apartmentId)
  invalidate(CACHE_KEYS.favorites)
}

export async function addToCompare(apartmentId: string, unitId: string) {
  const result = await _addToCompare(apartmentId, unitId)
  if (result.ok) invalidate(CACHE_KEYS.compare)
  return result
}

export async function removeFromCompare(compareItemId: string) {
  await _removeFromCompare(compareItemId)
  invalidate(CACHE_KEYS.compare)
}
