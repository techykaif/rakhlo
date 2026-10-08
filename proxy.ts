import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { SupabaseConfigError } from "@/lib/supabase/config";

const e2eProtectedApiPrefixes = [
  "/api/account",
  "/api/documents",
  "/api/purchases",
  "/api/reminders",
];

export async function proxy(request: NextRequest) {
  try {
    if (process.env.E2E_TEST_MODE === "1") {
      const pathname = request.nextUrl.pathname;

      if (e2eProtectedApiPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
        return new NextResponse(null, { status: 401 });
      }
    }

    return await updateSession(request);
  } catch (error) {
    if (!(error instanceof SupabaseConfigError)) {
      throw error;
    }

    console.error(
      "[Rakhlo] Supabase session middleware configuration error:",
      error.message,
    );

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
