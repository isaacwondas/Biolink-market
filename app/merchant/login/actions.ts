"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
  const cookieStore = await cookies();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

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

  // 1. Log in the user
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password,
    });

  if (authError) {
    return { error: authError.message };
  }

  const user = authData.user;
  let redirectTo = "/merchant/dashboard";

  if (user && user.email) {
    const normalizedEmail = user.email.toLowerCase();

    // Check if vendor exists
    const { data: existingVendor, error: lookupError } = await supabase
      .from("vendors")
      .select("id, is_onboarded")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (lookupError) {
      return { error: "Database lookup failed: " + lookupError.message };
    }

    // New user (no vendor row) → create one
    if (!existingVendor) {
      const { error: insertError } = await supabase.from("vendors").insert([
        {
          email: normalizedEmail,
          name: user.email.split("@")[0],
          username: null, // ← Leave null until onboarding
          views: 0,
          is_onboarded: false,
        },
      ]);

      if (insertError) {
        return { error: "Database sync failed: " + insertError.message };
      }

      redirectTo = "/merchant/onboard";
    } else if (!existingVendor.is_onboarded) {
      // Existing user but never finished onboarding
      redirectTo = "/merchant/onboard";
    } else {
      // Fully onboarded existing user → go to dashboard
      redirectTo = "/merchant/dashboard";
    }
  }

  return { success: true, redirectTo };
}
