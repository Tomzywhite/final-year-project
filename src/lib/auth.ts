import type { SupabaseClient } from '@supabase/supabase-js'
import type { Profile } from '@/types'

/**
 * Fetch the full profile row for a given user ID.
 * Used in server components and API/action handlers.
 */
export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data as Profile
}

/**
 * Get the currently authenticated user and their profile in one call.
 * Returns null if unauthenticated or if the profile is missing.
 */
export async function getCurrentUserWithProfile(
  supabase: SupabaseClient
): Promise<{ userId: string; profile: Profile } | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const profile = await getProfile(supabase, user.id)
  if (!profile) return null

  return { userId: user.id, profile }
}

/**
 * Update user profile details.
 */
export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: Partial<Pick<Profile, 'full_name' | 'matric_number'>>
): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)

  return !error
}
