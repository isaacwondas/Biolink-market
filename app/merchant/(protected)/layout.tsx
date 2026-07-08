import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {},
        remove(name, options) {},
      },
    },
  );

  // Check auth once for the entire directory tree
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthorized users instantly
  if (!user) {
    redirect("/admin/login");
  }

  // If authenticated, render the admin layout wrapper and nested pages safely
  return (
    <div className="admin-dashboard-layout antialiased selection:bg-[#044766] selection:text-white">
      {children}
    </div>
  );
}
