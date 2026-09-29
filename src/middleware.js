import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const token = request.cookies.get('admin_token')?.value;
    const session = token ? await verifySessionToken(token) : false;

    // If trying to access login page while already logged in -> redirect to /admin
    if (isLoginPage && session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // If trying to access protected admin pages while not logged in -> redirect to /admin/login
    if (!isLoginPage && !session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
