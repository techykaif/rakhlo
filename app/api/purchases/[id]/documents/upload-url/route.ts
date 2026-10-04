import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateDocumentUpload } from "@/lib/documents/validation";
import {
  createDocumentStoragePath,
  PURCHASE_DOCUMENTS_BUCKET,
} from "@/lib/documents/storage";
import {
  DOCUMENT_MAX_COUNT,
  DOCUMENT_MAX_TOTAL_BYTES,
} from "@/lib/documents/validation";

type Context = { params: Promise<{ id: string }> };

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  return { supabase, userId: data.claims.sub };
}

export async function POST(request: Request, context: Context) {
  const auth = await getAuthenticatedClient();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { supabase, userId } = auth;
  const { id: purchaseId } = await context.params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validation = validateDocumentUpload(body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 422 });
  }

  const { data: purchase, error: purchaseError } = await supabase
    .from("purchases")
    .select("id")
    .eq("id", purchaseId)
    .eq("user_id", userId)
    .maybeSingle();

  if (purchaseError) {
    return NextResponse.json({ error: "Unable to verify the purchase." }, { status: 500 });
  }

  if (!purchase) {
    return NextResponse.json({ error: "Purchase not found." }, { status: 404 });
  }

  const { data: existingDocuments, error: documentsError } = await supabase
    .from("documents")
    .select("size_bytes")
    .eq("purchase_id", purchaseId)
    .eq("user_id", userId);

  if (documentsError) {
    return NextResponse.json({ error: "Unable to verify attachment limits." }, { status: 500 });
  }

  const documentCount = existingDocuments?.length ?? 0;
  const documentBytes = (existingDocuments ?? []).reduce(
    (total, document) => total + Number(document.size_bytes || 0),
    0,
  );

  if (documentCount >= DOCUMENT_MAX_COUNT) {
    return NextResponse.json(
      { error: "A purchase can have at most 5 attachments." },
      { status: 409 },
    );
  }

  if (documentBytes + validation.data.size_bytes > DOCUMENT_MAX_TOTAL_BYTES) {
    return NextResponse.json(
      { error: "The total attachment size for a purchase cannot exceed 50 MB." },
      { status: 409 },
    );
  }

  const path = createDocumentStoragePath(
    userId,
    purchaseId,
    validation.data.mime_type,
  );

  const { data, error } = await supabase.storage
    .from(PURCHASE_DOCUMENTS_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data?.token) {
    return NextResponse.json({ error: "Unable to prepare the upload." }, { status: 500 });
  }

  return NextResponse.json({
    path,
    token: data.token,
    signedUrl: data.signedUrl,
    document: validation.data,
  });
}
