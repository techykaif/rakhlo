import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PURCHASE_DOCUMENTS_BUCKET } from "@/lib/documents/storage";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const supabase = await createClient();
  const { data: claims, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claims?.claims?.sub) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const userId = claims.claims.sub;
  const { id } = await context.params;

  const { data: document, error } = await supabase
    .from("documents")
    .select("id,storage_path")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Unable to load this document." }, { status: 500 });
  }

  if (!document) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const { data: signed, error: signingError } = await supabase.storage
    .from(PURCHASE_DOCUMENTS_BUCKET)
    .createSignedUrl(document.storage_path, 300);

  if (signingError || !signed?.signedUrl) {
    return NextResponse.json({ error: "Unable to prepare the download." }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
