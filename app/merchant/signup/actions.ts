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

    // Safety verification check for environment variables
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

    // 1. Sign up the new user in Supabase Auth with an explicit callback path
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        // Keeps user flow isolated from your root [username] catch-all segment
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?next=/merchant/onboard`,
      },
    });

    if (authError) return { error: authError.message };

    const user = authData.user;

    if (user && user.email) {
      // 2. Pre-populate their database row with a temporary placeholder username
      const generatedUsername = `vendor-${Math.floor(1000 + Math.random() * 9000)}`;
      const { error: insertError } = await supabase.from("vendors").insert([
        {
          email: user.email.toLowerCase(),
          name: user.email.split("@")[0],
          username: generatedUsername,
          views: 0,
        },
      ]);

      if (insertError) {
        return { error: "Profile creation failed: " + insertError.message };
      }
    }

    return { success: true };
  } catch (err: any) {
    // Intercepts structural application crashes and surfaces them transparently
    return {
      error: err?.message || "An unexpected system execution failure occurred.",
    };
  }
}
