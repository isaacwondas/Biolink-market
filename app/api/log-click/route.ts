import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vendor_id, platform, device_type } = body;

    // Fast-fail validation to prevent database overhead on malformed queries
    if (!vendor_id || !platform) {
      return new NextResponse("Missing tracking parameters", { status: 400 });
    }

    // Direct, un-awaited insert. We want to return a response to the user
    // instantly without waiting for the DB write confirmation to finish.
    supabase
      .from("vendor_clicks_log")
      .insert({
        vendor_id: Number(vendor_id),
        platform,
        device_type: device_type || "mobile",
      })
      .then(({ error }) => {
        if (error)
          console.error("Background telemetry log error:", error.message);
      });

    // Instantly return 200 OK back to the browser so the UI click feels immediate
    return NextResponse.json({ tracked: true }, { status: 200 });
  } catch (err) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
