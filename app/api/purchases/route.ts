import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validatePurchaseInput } from "@/lib/purchases/validation";

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return { supabase: null, userId: null };
  }

  return { supabase, userId: data.claims.sub };
}

export async function GET(request: Request) {
  const { supabase } = await getAuthenticatedClient();

  if (!supabase) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const search = url.searchParams.get("q")?.trim().slice(0, 80) ?? "";

  let query = supabase
    .from("purchases")
    .select(
      "id,title,purchase_date,amount,currency,seller_name,category_id,quantity,status,notes,created_at,updated_at,categories(name)",
    )
    .order("purchase_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  if (search) {
    const safeSearch = search.replace(/[,*()]/g, " ").trim();

    if (safeSearch) {
      query = query.or(
        `title.ilike.%${safeSearch}%,seller_name.ilike.%${safeSearch}%,notes.ilike.%${safeSearch}%`,
      );
    }
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Unable to load purchases." }, { status: 500 });
  }

  return NextResponse.json({ purchases: data ?? [] });
}

export async function POST(request: Request) {
  const { supabase } = await getAuthenticatedClient();

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

  const { data, error } = await supabase
    .from("purchases")
    .insert(validation.data)
    .select(
      "id,title,purchase_date,amount,currency,seller_name,category_id,quantity,status,notes,created_at,updated_at",
    )
    .single();

  if (error) {
    return NextResponse.json({ error: "Unable to save this purchase." }, { status: 400 });
  }

  return NextResponse.json({ purchase: data }, { status: 201 });
}
