import { createServerClient, type CookieOptions } from "@supabase/ssr";
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

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  console.log("Exchange Error:", error);

  if (error) {
    return NextResponse.redirect(
      `${origin}/merchant/login?error=auth-callback-failed`,
    );
  }

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
      // Brand new user → create vendor row
      const { error: insertError } = await supabase.from("vendors").insert({
        email: normalizedEmail,
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email.split("@")[0],
        username: null, // ← Leave null until onboarding
        views: 0,
        is_onboarded: false,
      });

      if (insertError) {
        console.error("Vendor creation failed:", insertError);
        return NextResponse.redirect(
          `${origin}/merchant/login?error=vendor-creation-failed`,
        );
      }

      redirectPath = "/merchant/onboard";
    } else {
      // Existing user → check if they finished onboarding
      redirectPath = existingVendor.is_onboarded
        ? "/merchant/dashboard"
        : "/merchant/onboard";
    }
  }

  console.log("===== AUTH CALLBACK END =====");

  return NextResponse.redirect(`${origin}${redirectPath}`);
}
