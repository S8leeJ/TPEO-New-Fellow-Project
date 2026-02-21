import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ApartmentCard from './ApartmentCard'

export default async function ApartmentsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const { data: apartments, error: apartmentsError } = await supabase
        .from('apartments')
        .select('id, name')

    if (apartmentsError) {
        console.error('Error fetching apartments:', apartmentsError)
        return <div className="p-4 text-red-500">Error loading apartments</div>
    }

    // Fetch user's apartment-level favorites (unit_id is null = starred building, not a specific unit)
    const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select('apartment_id')
        .eq('user_id', user.id)
        .is('unit_id', null)

    if (favoritesError) {
        console.error('Error fetching favorites:', favoritesError)
    }

    const favoriteIds = new Set(favorites?.map(f => f.apartment_id))

    return (
        <div className="flex min-h-screen flex-col items-center p-8">
            <h1 className="mb-8 text-3xl font-bold">Apartments</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {apartments?.map((apartment) => (
                    <ApartmentCard
                        key={apartment.id}
                        apartment={apartment}
                        initialIsFavorite={favoriteIds.has(apartment.id)}
                    />
                ))}
            </div>
            {apartments?.length === 0 && (
                <div className="text-center text-gray-500">No apartments found.</div>
            )}
        </div>
    )
}
