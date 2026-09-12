import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Resolve the true origin: Vercel sets x-forwarded-host in production
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const origin = isLocalEnv
    ? requestUrl.origin
    : forwardedHost
    ? `https://${forwardedHost}`
    : requestUrl.origin;

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("[auth/callback] exchangeCodeForSession error:", error.message);
    }
  }

  // Return the user to an error page or login with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate`);
}
