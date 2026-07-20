import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  console.log("===== AUTH CALLBACK START =====");

  if (!code) {
    console.log("No auth code");
    return NextResponse.redirect(
      `${origin}/merchant/login?error=missing-auth-code`,
    );
  }

  const cookieStore = await cookies();

  // 1. Create a dummy redirection response first so we can write cookies directly to its headers.
  // This is critical in Next.js Route Handlers to ensure cookies aren't dropped.
  const response = NextResponse.redirect(`${origin}/merchant/onboard`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Write to the cookie store (for server context)
              cookieStore.set(name, value, options);
              // Write to the redirection response (to persist back to the browser)
              response.cookies.set(name, value, options);
            });
          } catch {
            // Safe to ignore if called during render
          }
        },
      },
    },
  );

  // 2. Exchange authorization code for session
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  console.log("Exchange Error:", error);

  if (error) {
    return NextResponse.redirect(
      `${origin}/merchant/login?error=auth-callback-failed`,
    );
  }

  // 3. Fetch authenticated user safely
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("User Error:", userError);
  console.log("Authenticated User:", user);

  let redirectPath = "/merchant/onboard";

  if (user?.email) {
    const normalizedEmail = user.email.toLowerCase();

    // Check if vendor already exists (from Google OAuth or Email signup)
    const { data: existingVendor, error: lookupError } = await supabase
      .from("vendors")
      .select("id, is_onboarded")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (lookupError) {
      console.error("Vendor lookup failed:", lookupError);
      return NextResponse.redirect(
        `${origin}/merchant/login?error=vendor-lookup-failed`,
      );
    }

    if (!existingVendor) {
      // Brand new user → create vendor row with Upsert fallback to prevent duplication errors
      const { error: upsertError } = await supabase.from("vendors").upsert(
        {
          auth_user_id: user.id,
          email: normalizedEmail,
          name:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email.split("@")[0],
          username: null,
          views: 0,
          is_onboarded: false,
        },
        { onConflict: "email" },
      );

      if (upsertError) {
        console.error("Vendor creation failed:", upsertError);
        return NextResponse.redirect(
          `${origin}/merchant/login?error=vendor-creation-failed`,
        );
      }

      redirectPath = "/merchant/onboard";
    } else {
      // Existing user → route conditionally
      redirectPath = existingVendor.is_onboarded
        ? "/merchant/dashboard"
        : "/merchant/onboard";
    }
  }

  console.log("===== AUTH CALLBACK END =====");

  // 4. Set the final redirection URL on the response with our written cookies
  const finalRedirectUrl = new URL(redirectPath, origin);

  // Clone or overwrite url destination keeping the existing response headers (cookies)
  return NextResponse.redirect(finalRedirectUrl.toString(), {
    headers: response.headers,
  });
}
