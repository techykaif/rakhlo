import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

const e2eProtectedPrefixes = [
  "/dashboard",
  "/purchases",
  "/reminders",
  "/account",
];

function isE2EProtectedRoute(pathname: string) {
  return e2eProtectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function updateSession(request: NextRequest) {
  if (process.env.E2E_TEST_MODE === "1") {
    if (isE2EProtectedRoute(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });
  const { url, publishableKey } = getSupabaseConfig();

  const supabase = createServerClient(
    url,
    publishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });

          Object.entries(headers).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, value);
          });
        },
      },
    },
  );

  await supabase.auth.getClaims();

  return supabaseResponse;
}
