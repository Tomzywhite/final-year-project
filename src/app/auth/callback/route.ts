import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * OAuth callback route — handles the redirect from Microsoft/Azure
 * after the user successfully authenticates.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // After Microsoft login, redirect them to the main app.
      // The proxy will assess their role and send them to the right portal.
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If something goes wrong, redirect to login with error param
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
