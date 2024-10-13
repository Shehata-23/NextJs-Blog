import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/Signup', '/Login', '/LandingPage', '/', "/ResetPassword"]

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token')?.value
  const { pathname } = request.nextUrl

  const isPublicRoute = publicRoutes.includes(pathname)

  if (isPublicRoute) {
    if (token) {
      return NextResponse.redirect(new URL('/Dashboard/Home', request.url))
    }
  } else {
    if (!token) {
      const from = request.nextUrl.pathname
      const url = new URL('/Login', request.url)
      url.searchParams.set('from', from)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
   
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}