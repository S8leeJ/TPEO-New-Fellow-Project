'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function getApartments(): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('apartments')
    .select('id, name')
    .order('name')

  if (error) {
    console.error('Error fetching apartments:', error)
    return []
  }

  return data ?? []
}

export type UnitWithApartment = {
  id: string
  apartment_id: string
  room_type: string
  bedrooms: number | null
  bathrooms: number | null
  sq_ft: number | null
  floor: number | null
  windows: string | null
  apartment: { id: string; name: string }
}

export async function getUnitsByApartmentIds(
  apartmentIds: string[]
): Promise<UnitWithApartment[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  if (apartmentIds.length === 0) return []

  const { data: units, error: unitsError } = await supabase
    .from('units')
    .select('id, apartment_id, room_type, bedrooms, bathrooms, sq_ft, floor, windows')
    .in('apartment_id', apartmentIds)
    .order('apartment_id')
    .order('room_type')

  if (unitsError) {
    console.error('Error fetching units:', unitsError)
    return []
  }

  const aptIds = [...new Set((units ?? []).map((u) => u.apartment_id))]
  if (aptIds.length === 0) return []

  const { data: apartments, error: aptError } = await supabase
    .from('apartments')
    .select('id, name')
    .in('id', aptIds)

  if (aptError) {
    console.error('Error fetching apartments:', aptError)
    return []
  }

  const aptMap = new Map((apartments ?? []).map((a) => [a.id, a]))
  return (units ?? []).map((u) => ({
    ...u,
    apartment: aptMap.get(u.apartment_id) ?? { id: u.apartment_id, name: 'Unknown' },
  }))
}

export type CompareItemWithDetails = {
  id: string
  apartment_id: string
  unit_id: string
  apartment: { id: string; name: string }
  unit: {
    id: string
    room_type: string
    bedrooms: number | null
    bathrooms: number | null
    sq_ft: number | null
    floor: number | null
    windows: string | null
  }
}

export async function getCompareItems(): Promise<CompareItemWithDetails[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: items, error: itemsError } = await supabase
    .from('favorites')
    .select('id, apartment_id, unit_id')
    .eq('user_id', user.id)
    .not('unit_id', 'is', null)

  if (itemsError) {
    console.error('Error fetching compare items:', itemsError)
    return []
  }

  if (!items?.length) return []

  const unitIds = items.map((i) => i.unit_id).filter(Boolean) as string[]
  const aptIds = [...new Set(items.map((i) => i.apartment_id))]

  const [{ data: units }, { data: apartments }] = await Promise.all([
    supabase.from('units').select('id, apartment_id, room_type, bedrooms, bathrooms, sq_ft, floor, windows').in('id', unitIds),
    supabase.from('apartments').select('id, name').in('id', aptIds),
  ])

  const unitMap = new Map((units ?? []).map((u) => [u.id, u]))
  const aptMap = new Map((apartments ?? []).map((a) => [a.id, a]))

  return items
    .filter((i) => i.unit_id && unitMap.has(i.unit_id) && aptMap.has(i.apartment_id))
    .map((i) => ({
      id: i.id,
      apartment_id: i.apartment_id,
      unit_id: i.unit_id!,
      apartment: aptMap.get(i.apartment_id)!,
      unit: unitMap.get(i.unit_id!)!,
    }))
}

export async function addToCompare(apartmentId: string, unitId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase.from('favorites').insert({
    user_id: user.id,
    apartment_id: apartmentId,
    unit_id: unitId,
  })

  if (error) {
    console.error('Error adding to compare:', error)
    throw error
  }

  revalidatePath('/dashboard/compare')
  revalidatePath('/apartments')
}

export async function removeFromCompare(favoriteId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', favoriteId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error removing from compare:', error)
    throw error
  }

  revalidatePath('/dashboard/compare')
  revalidatePath('/apartments')
}
