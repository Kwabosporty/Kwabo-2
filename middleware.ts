import { createClient } from '@supabase/supabase-js';

/**
 * Next.js 15 (App Router) Middleware Auth Guard: middleware.ts
 *
 * Security & Access Rules:
 * 1. Checks for a valid Supabase Auth session on all /admin/* routes (except /admin/login).
 * 2. If unauthenticated, redirects instantly to /admin/login.
 * 3. Fetches the user's role from the public.profiles table.
 * 4. If role is NOT SUPER_ADMIN or EDITOR, signs out immediately and redirects to
 *    /admin/403 with '403 Access Denied: Admin Privileges Required'.
 */

// Types matching Next.js 15 App Router NextRequest & NextResponse
export type NextRequestLike = Request & {
  nextUrl: URL & {
    pathname: string;
    searchParams: URLSearchParams;
    clone: () => URL;
  };
  cookies: {
    get: (name: string) => { name: string; value: string } | undefined;
    getAll: () => Array<{ name: string; value: string }>;
    set: (name: string, value: string) => void;
  };
};

export class NextURL extends URL {
  clone(): NextURL {
    return new NextURL(this.toString());
  }
}

export async function middleware(request: NextRequestLike) {
  const url = request.nextUrl || new URL(request.url);
  const pathname = url.pathname;

  // 1. Skip non-admin routes and explicitly allow /admin/login and /admin/403
  if (!pathname.startsWith('/admin') || pathname === '/admin/login' || pathname === '/admin/403') {
    return;
  }

  const supabaseUrl =
    (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL)) ||
    'https://kwabo-sports.supabase.co';
  const supabaseAnonKey =
    (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY)) ||
    'public-anon-key-kwabo';

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  // Extract auth token from authorization header or cookie
  const authHeader = request.headers.get('authorization');
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const tokenFromCookie =
    request.cookies.get('sb-access-token')?.value ||
    request.cookies.get('kwabo_admin_auth_token')?.value ||
    request.cookies.get('supabase-auth-token')?.value;

  const accessToken = tokenFromHeader || tokenFromCookie;

  // 2. If unauthenticated, redirect instantly to /admin/login
  if (!accessToken) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return Response.redirect(loginUrl.toString(), 307);
  }

  // Verify session with Supabase Auth
  const { data: userData, error: authError } = await supabase.auth.getUser(accessToken);

  if (authError || !userData?.user) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('error', 'session_expired');
    return Response.redirect(loginUrl.toString(), 307);
  }

  const user = userData.user;

  // 3. Fetch user's role from the public.profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const userRole = profile?.role || user.user_metadata?.role || user.app_metadata?.role;

  // 4. Strict Role Check: Must be SUPER_ADMIN or EDITOR
  if (profileError || !userRole || (userRole !== 'SUPER_ADMIN' && userRole !== 'EDITOR')) {
    // Sign out immediately
    await supabase.auth.signOut();

    // Render / redirect to '403 Access Denied: Admin Privileges Required'
    const forbiddenUrl = new URL('/admin/403', request.url);
    forbiddenUrl.searchParams.set('error', 'access_denied');
    forbiddenUrl.searchParams.set('role', String(userRole || 'UNKNOWN'));
    return Response.redirect(forbiddenUrl.toString(), 307);
  }

  // Authorized: Access granted to /admin/dashboard
  return;
}

// Next.js Route Matcher Configuration
export const config = {
  matcher: ['/admin/:path*'],
};
