import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validatePurchaseInput } from "@/lib/purchases/validation";

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  return supabase;
}

async function getId(context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return id;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await getAuthenticatedClient();

  if (!supabase) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const id = await getId(context);
  const { data, error } = await supabase
    .from("purchases")
    .select(
      "id,title,purchase_date,amount,currency,seller_name,category_id,quantity,status,notes,created_at,updated_at,categories(name)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Unable to load this purchase." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Purchase not found." }, { status: 404 });
  }

  return NextResponse.json({ purchase: data });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await getAuthenticatedClient();

  if (!supabase) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validation = validatePurchaseInput(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Please correct the highlighted fields.", fields: validation.errors },
      { status: 422 },
    );
  }

  const id = await getId(context);
  const { data, error } = await supabase
    .from("purchases")
    .update(validation.data)
    .eq("id", id)
    .select(
      "id,title,purchase_date,amount,currency,seller_name,category_id,quantity,status,notes,created_at,updated_at",
    )
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Unable to update this purchase." }, { status: 400 });
  }

  if (!data) {
    return NextResponse.json({ error: "Purchase not found." }, { status: 404 });
  }

  return NextResponse.json({ purchase: data });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await getAuthenticatedClient();

  if (!supabase) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const id = await getId(context);
  const { data, error } = await supabase
    .from("purchases")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Unable to delete this purchase." }, { status: 400 });
  }

  if (!data) {
    return NextResponse.json({ error: "Purchase not found." }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
