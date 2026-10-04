import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateDocumentUpload } from "@/lib/documents/validation";
import { validateFileSignature } from "@/lib/documents/signature";
import {
  getDocumentBasename,
  isOwnedPurchaseDocumentPath,
  PURCHASE_DOCUMENTS_BUCKET,
} from "@/lib/documents/storage";

type Context = { params: Promise<{ id: string }> };

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  return { supabase, userId: data.claims.sub };
}

export async function GET(_request: Request, context: Context) {
  const auth = await getAuthenticatedClient();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { supabase, userId } = auth;
  const { id: purchaseId } = await context.params;

  const { data: documents, error } = await supabase
    .from("documents")
    .select("id,purchase_id,type,storage_path,filename,mime_type,size_bytes,created_at")
    .eq("purchase_id", purchaseId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Unable to load documents." }, { status: 500 });
  }

  return NextResponse.json({ documents: documents ?? [] });
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
  const value =
    body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : null;
  const path = typeof value?.path === "string" ? value.path.trim() : "";

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 422 });
  }

  if (!isOwnedPurchaseDocumentPath(path, userId, purchaseId)) {
    return NextResponse.json({ error: "Invalid document path." }, { status: 422 });
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

  const basename = getDocumentBasename(path);
  const { data: objects, error: storageError } = await supabase.storage
    .from(PURCHASE_DOCUMENTS_BUCKET)
    .list(userId + "/" + purchaseId, {
      search: basename,
      limit: 20,
    });

  if (storageError) {
    return NextResponse.json({ error: "Unable to verify the uploaded file." }, { status: 500 });
  }

  if (!objects?.some((object) => object.name === basename)) {
    return NextResponse.json(
      { error: "Upload has not completed. Please try again." },
      { status: 409 },
    );
  }

  const { data: uploadedFile, error: downloadError } = await supabase.storage
    .from(PURCHASE_DOCUMENTS_BUCKET)
    .download(path);

  if (downloadError || !uploadedFile) {
    return NextResponse.json({ error: "Unable to verify the uploaded file." }, { status: 422 });
  }

  if (uploadedFile.size !== validation.data.size_bytes) {
    await supabase.storage.from(PURCHASE_DOCUMENTS_BUCKET).remove([path]);
    return NextResponse.json({ error: "Uploaded file size does not match." }, { status: 422 });
  }

  const bytes = new Uint8Array(await uploadedFile.slice(0, 32).arrayBuffer());
  const signature = validateFileSignature(validation.data.mime_type, bytes);

  if (!signature.ok) {
    await supabase.storage.from(PURCHASE_DOCUMENTS_BUCKET).remove([path]);
    return NextResponse.json({ error: signature.reason ?? "Invalid file content." }, { status: 422 });
  }

  const { data: document, error } = await supabase
    .from("documents")
    .insert({
      purchase_id: purchaseId,
      type: validation.data.type,
      storage_path: path,
      filename: validation.data.filename,
      mime_type: validation.data.mime_type,
      size_bytes: validation.data.size_bytes,
    })
    .select("id,purchase_id,type,storage_path,filename,mime_type,size_bytes,created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "Unable to save the document." }, { status: 400 });
  }

  return NextResponse.json({ document }, { status: 201 });
}
