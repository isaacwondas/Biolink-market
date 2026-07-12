import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
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

  // =============================================
  // GUARD 1: Unauthenticated users
  // =============================================
  if (!session) {
    // Allow: login, signup, confirmed pages
    if (
      url.pathname.startsWith("/merchant/login") ||
      url.pathname.startsWith("/merchant/signup") ||
      url.pathname.startsWith("/merchant/confirmed")
    ) {
      return response;
    }

    // Block: redirect to login for protected routes
    url.pathname = "/merchant/login";
    return NextResponse.redirect(url);
  }

  // =============================================
  // GUARD 2: Authenticated users — check onboarding
  // =============================================
  if (session && session.user?.email) {
    const { data: vendor } = await supabase
      .from("vendors")
      .select("is_onboarded")
      .eq("email", session.user.email.toLowerCase())
      .maybeSingle();

    const isOnboarded = vendor?.is_onboarded ?? false;

    // If trying to access login/signup while authenticated
    if (
      url.pathname.startsWith("/merchant/login") ||
      url.pathname.startsWith("/merchant/signup")
    ) {
      if (isOnboarded) {
        // Finished onboarding → go to dashboard
        url.pathname = "/merchant/dashboard";
      } else {
        // NOT finished onboarding → go to onboard ⭐ THIS FIXES YOUR BUG
        url.pathname = "/merchant/onboard";
      }
      return NextResponse.redirect(url);
    }

    // If trying to access dashboard without completing onboarding
    if (url.pathname.startsWith("/merchant/dashboard")) {
      if (!isOnboarded) {
        url.pathname = "/merchant/onboard";
        return NextResponse.redirect(url);
      }
    }

    // If trying to access share page without completing onboarding
    if (url.pathname.startsWith("/merchant/share")) {
      if (!isOnboarded) {
        url.pathname = "/merchant/onboard";
        return NextResponse.redirect(url);
      }
    }

    // If trying to access onboard but already completed
    if (url.pathname.startsWith("/merchant/onboard")) {
      if (isOnboarded) {
        url.pathname = "/merchant/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/merchant/:path*"],
};
