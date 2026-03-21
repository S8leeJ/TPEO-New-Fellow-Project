'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function getFavoriteApartmentIds(): Promise<Set<string>> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return new Set()

    const { data, error } = await supabase
        .from('favorites')
        .select('apartment_id')
        .eq('user_id', user.id)

    if (error) {
        console.error('Error fetching favorites:', error)
        return new Set()
    }

    return new Set((data ?? []).map((r) => r.apartment_id))
}

export async function addFavorite(apartmentId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')
    if (!apartmentId) return

    const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, apartment_id: apartmentId })

    if (error) {
        console.error('Error adding favorite:', error)
        throw error
    }

    revalidatePath('/apartments')
}

export async function removeFavorite(apartmentId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')
    if (!apartmentId) return

    const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('apartment_id', apartmentId)

    if (error) {
        console.error('Error removing favorite:', error)
        throw error
    }

    revalidatePath('/apartments')
}
