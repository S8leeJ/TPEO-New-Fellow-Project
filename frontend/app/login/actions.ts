
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (signInError) {
        redirect('/login?error=Could not authenticate user')
    }

    const user = data?.user
    if (user) {
        const { error: upsertError } = await supabase.from('users').upsert({
            id: user.id,
            email: user.email,
        })

        if (upsertError) {
            redirect('/login?error=Could not create user profile')
        }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        redirect('/login?error=Could not authenticate user')
    }

    const user = data?.user
    if (user) {
        // Ensure there's a corresponding profile row in `Users`.
        // Use upsert to be idempotent if the row already exists.
        const { error: upsertError } = await supabase.from('users').upsert({
            id: user.id,
            email: user.email,
        })

        if (upsertError) {
            redirect('/login?error=Could not create user profile')
        }
    }

    revalidatePath('/', 'layout')
    redirect('/login?message=Check email to continue sign in process')
}
