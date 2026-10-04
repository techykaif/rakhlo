import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { SupabaseConfigError } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  try {
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
