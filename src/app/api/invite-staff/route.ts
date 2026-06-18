import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentUserWithProfile } from '@/lib/auth'

/**
 * POST /api/invite-staff
 * Body: { email: string, full_name: string }
 *
 * Sends a Supabase "invite" email to the given address.
 * The invited user clicks the link, lands on /auth/callback,
 * and is redirected to set their password then into the portal.
 *
 * Only super_admin can call this endpoint.
 */
export async function POST(request: Request) {
  try {
    // 1. Verify the caller is a super_admin
    const supabase = await createClient()
    const result = await getCurrentUserWithProfile(supabase)

    if (!result || result.profile.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 2. Parse the body
    const body = await request.json()
    const { email, full_name } = body as { email?: string; full_name?: string }

    if (!email || !full_name) {
      return NextResponse.json(
        { error: 'email and full_name are required.' },
        { status: 400 }
      )
    }

    // 3. Use the admin client to invite the user
    const adminClient = createAdminClient()
    const { error } = await adminClient.auth.admin.inviteUserByEmail(email, {
      // Pass metadata so the DB trigger can set the right role & name on profile creation
      data: {
        full_name,
        role: 'pending_admin',
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/auth/callback`,
    })

    if (error) {
      console.error('[invite-staff] Supabase invite error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to send invite.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[invite-staff] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
