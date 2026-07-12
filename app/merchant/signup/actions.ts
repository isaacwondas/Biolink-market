"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function signupAction(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Email and password are required." };
    }
    if (password.length < 8) {
      return { error: "Password must be at least 8 characters long." };
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return {
        error:
          "Server Configuration Error: Supabase environment variables are missing or undefined inside your local .env file.",
      };
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

    // 1. Sign up the new user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?next=/merchant/onboard`,
      },
    });

    if (authError) return { error: authError.message };

    const user = authData.user;

    if (user && user.email) {
      // 2. Create vendor row with username: null (set during onboarding)
      const { error: insertError } = await supabase.from("vendors").insert([
        {
          email: user.email.toLowerCase(),
          name: user.email.split("@")[0],
          username: null, // ← Leave null until onboarding
          views: 0,
          is_onboarded: false, // ← Explicitly set to false
        },
      ]);

      if (insertError) {
        return { error: "Profile creation failed: " + insertError.message };
      }
    }

    return { success: true };
  } catch (err: any) {
    return {
      error: err?.message || "An unexpected system execution failure occurred.",
    };
  }
}
