import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  const pathname = request.nextUrl.pathname

  // Public paths
  if (
    pathname === '/login' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/brand') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/patterns') ||
    pathname.startsWith('/map') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    if (user && pathname === '/login') {
      return NextResponse.redirect(new URL('/division-admin', request.url))
    }
    return supabaseResponse
  }

  // Check if authenticated via Supabase session or local demo session cookie
  const demoUser = request.cookies.get('demo_user')?.value

  if (!user && !demoUser && process.env.NODE_ENV !== 'development') {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect_to', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

