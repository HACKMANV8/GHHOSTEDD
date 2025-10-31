// middleware.ts (project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value; // ← same name as backend
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/login', '/signup'];
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  // 1. Un-auth → protected route → login
  if (!token && !isPublic && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Auth → login/signup → missions
  if (token && isPublic) {
    return NextResponse.redirect(new URL('/missions', request.url));
  }

  // 3. Root redirect
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(token ? '/missions' : '/login', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};