import { NextResponse } from "next/server";
import { NextRequest } from "next/server"; // Fixed import source
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Set on response since request cookies are read-only at the edge
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // 1. Try to read the native Supabase session
  let {
    data: { session },
  } = await supabase.auth.getSession();

  // 2. FALLBACK CHECK: If session is empty, check if explicit manual tokens exist
  if (!session) {
    const accessToken = request.cookies.get("sb-access-token")?.value;
    const refreshToken = request.cookies.get("sb-refresh-token")?.value;

    if (accessToken && refreshToken) {
      session = {
        access_token: accessToken,
        refresh_token: refreshToken,
      } as any;
    }
  }

  const url = request.nextUrl.clone();

  // Guard 1: Kick out unauthenticated users trying to access onboarding
  if (url.pathname.startsWith("/admin/onboard") && !session) {
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Guard 2: Redirect logged-in users away from the login screen
  if (url.pathname.startsWith("/admin/login") && session) {
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
