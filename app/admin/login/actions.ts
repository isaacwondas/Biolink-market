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

  // Initialize Supabase SSR Client
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
      email: email.trim(),
      password: password,
    });

  if (authError) {
    return { error: authError.message };
  }

  const user = authData.user;
  let isNewVendor = false;

  if (user && user.email) {
    // 2. Query your manual table using the email bridge
    const { data: existingVendor } = await supabase
      .from("vendors")
      .select("username")
      .eq("email", user.email.toLowerCase())
      .maybeSingle();

    // 3. Create the database row dynamically if it's missing
    if (!existingVendor) {
      isNewVendor = true;
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
        return { error: "Database sync failed: " + insertError.message };
      }
    }
  }

  // 4. Fallback or target redirection handling based on routing status
  const redirectTo = isNewVendor ? "/admin/onboard" : "/admin/dashboard";

  return { success: true, redirectTo };
}
