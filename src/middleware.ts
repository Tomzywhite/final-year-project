import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/register', '/unauthorized', '/privacy', '/terms', '/help', '/directory']

// Routes that redirect logged-in users away (no point visiting login when signed in)
const AUTH_ROUTES = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Build a response object we can attach cookies to
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not run any logic between createServerClient and getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ── No session ────────────────────────────────────────────────────────────
  if (!user) {
    // Allow public routes through
    if (PUBLIC_ROUTES.includes(pathname)) {
      return supabaseResponse
    }
    // Everything else requires login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ── User is authenticated — fetch their role ──────────────────────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role

  // Redirect logged-in users away from /login and /register
  if (AUTH_ROUTES.includes(pathname)) {
    if (role === 'pending_admin') return NextResponse.redirect(new URL('/pending-approval', request.url))
    
    const destination =
      role === 'admin' || role === 'super_admin' ? '/admin/dashboard' : '/student/dashboard'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  // Handle exactly root
  if (pathname === '/') {
    if (role === 'pending_admin') return NextResponse.redirect(new URL('/pending-approval', request.url))

    const destination =
      role === 'admin' || role === 'super_admin' ? '/admin/dashboard' : '/student/dashboard'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  // Ensure pending admins can ONLY access pending approval page
  if (role === 'pending_admin' && pathname !== '/pending-approval') {
    return NextResponse.redirect(new URL('/pending-approval', request.url))
  }

  // Ensure ONLY pending_admin users can access pending approval page
  if (pathname === '/pending-approval' && role !== 'pending_admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // ── Role-based route guard ────────────────────────────────────────────────
  if (pathname.startsWith('/student') && role !== 'student') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  if (pathname.startsWith('/admin') && (role !== 'admin' && role !== 'super_admin')) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico
     * - public assets (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
