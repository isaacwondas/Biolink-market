import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/merchant/onboard";

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

  if (user?.email) {
    console.log("Checking vendor...");

    const { data: existingVendor, error: lookupError } = await supabase
      .from("vendors")
      .select("id")
      .eq("email", user.email.toLowerCase())
      .maybeSingle();

    console.log("Lookup:", existingVendor, lookupError);

    if (!existingVendor) {
      console.log("Creating vendor...");

      const { data, error: insertError } = await supabase
        .from("vendors")
        .insert([
          {
            email: user.email.toLowerCase(),
            name:
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.email.split("@")[0],
            username: `vendor-${Math.floor(1000 + Math.random() * 9000)}`,
            views: 0,
            is_onboarded: false,
          },
        ])
        .select();

      console.log("Insert Result:", data);
      console.log("Insert Error:", insertError);
    }
  }

  console.log("===== AUTH CALLBACK END =====");

  return NextResponse.redirect(`${origin}${next}`);
}
