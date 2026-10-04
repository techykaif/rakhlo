import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PURCHASE_DOCUMENTS_BUCKET } from "@/lib/documents/storage";

type Context = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: Context) {
  const supabase = await createClient();
  const { data: claims, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claims?.claims?.sub) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const userId = claims.claims.sub;
  const { id } = await context.params;

  const { data: document, error: documentError } = await supabase
    .from("documents")
    .select("id,storage_path")
    .eq("id", id)
    .maybeSingle();

  if (documentError) {
    return NextResponse.json({ error: "Unable to load this document." }, { status: 500 });
  }

  if (!document) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const { error: storageError } = await supabase.storage
    .from(PURCHASE_DOCUMENTS_BUCKET)
    .remove([document.storage_path]);

  if (storageError) {
    return NextResponse.json({ error: "Unable to remove the stored file." }, { status: 500 });
  }

  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "The file was removed, but its record could not be cleared." },
      { status: 500 },
    );
  }

  return new Response(null, { status: 204 });
}
