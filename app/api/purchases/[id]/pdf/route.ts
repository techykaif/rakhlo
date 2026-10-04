import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const A4: [number, number] = [595.28, 841.89];
const MARGIN = 48;

function clean(value: string | number | null | undefined) {
  return String(value ?? "Not provided")
    .replace(/₹/g, "INR ")
    .replace(/[→•·]/g, "-")
    .replace(/—/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function money(value: number, currency: string) {
  return clean(new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 2,
  }).format(value));
}

function date(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(value + "T00:00:00Z"))
    : "Not set";
}

function wrap(text: string, maxChars = 88) {
  const words = clean(text).split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? line + " " + word : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const download = new URL(request.url).searchParams.get("download") === "1";
  const supabase = await createClient();

  const [{ data: purchase }, { data: documents }, { data: items }, { data: payments }, { data: warranties }] =
    await Promise.all([
      supabase.from("purchases").select("id,title,purchase_date,amount,currency,seller_name,quantity,status,notes,categories(name),return_start_date,return_end_date").eq("id", id).maybeSingle(),
      supabase.from("documents").select("id,type,storage_path,filename,mime_type,size_bytes,created_at").eq("purchase_id", id).order("created_at"),
      supabase.from("purchase_items").select("id,name,quantity,unit_price,serial_number,imei,notes,status").eq("purchase_id", id).order("created_at"),
      supabase.from("payments").select("id,amount,method,paid_at,reference,notes").eq("purchase_id", id).order("paid_at", { ascending: false }),
      supabase.from("warranties").select("id,start_date,end_date,provider,notes").eq("purchase_id", id).order("end_date"),
    ]);

  if (!purchase) return NextResponse.json({ error: "Purchase not found" }, { status: 404 });

  const signed = documents?.length
    ? await supabase.storage.from("purchase-documents").createSignedUrls(
        documents.map((document) => document.storage_path), 600,
      )
    : { data: [] };

  const urls = new Map((signed.data ?? []).map((entry, index) => [documents?.[index]?.id, entry.signedUrl]));

  const pdf = await PDFDocument.create();
  pdf.setTitle(clean(purchase.title));
  pdf.setSubject("Rakhlo purchase record");
  pdf.setCreator("Rakhlo");

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage(A4);
  let y = A4[1] - MARGIN;

  const addPage = () => {
    page = pdf.addPage(A4);
    y = A4[1] - MARGIN;
  };
  const ensure = (height: number) => {
    if (y - height < MARGIN) addPage();
  };
  const heading = (text: string) => {
    ensure(42);
    page.drawText(text, { x: MARGIN, y, size: 8, font: bold, color: rgb(.45,.45,.42) });
    y -= 22;
  };
  const section = (title: string, lines: string[]) => {
    ensure(40);
    page.drawText(title, { x: MARGIN, y, size: 13, font: bold });
    y -= 20;
    for (const line of lines) {
      for (const part of wrap(line)) {
        ensure(17);
        page.drawText(part, { x: MARGIN, y, size: 9, font: regular });
        y -= 13;
      }
      y -= 5;
    }
  };

  page.drawText("RAKHLO", { x: MARGIN, y, size: 10, font: bold });
  y -= 28;
  heading("PURCHASE RECORD");
  for (const line of wrap(purchase.title, 54)) {
    ensure(30);
    page.drawText(line, { x: MARGIN, y, size: 24, font: bold });
    y -= 28;
  }
  page.drawText("Complete snapshot of the purchase and its stored documents.", {
    x: MARGIN, y, size: 9, font: regular, color: rgb(.42,.42,.39),
  });
  y -= 28;

  const labelValue = (label: string, value: string) => {
    ensure(34);
    page.drawText(label.toUpperCase(), { x: MARGIN, y, size: 7, font: bold, color: rgb(.48,.48,.45) });
    y -= 13;
    for (const line of wrap(value, 64)) {
      page.drawText(line, { x: MARGIN, y, size: 10, font: regular });
      y -= 14;
    }
    y -= 8;
  };

  labelValue("Purchase date", date(purchase.purchase_date));
  labelValue("Amount", money(Number(purchase.amount), purchase.currency || "INR"));
  labelValue("Quantity", clean(purchase.quantity));
  labelValue("Seller", purchase.seller_name || "Not provided");
  labelValue("Category", purchase.categories?.name || "Not provided");
  labelValue("Status", purchase.status);
  labelValue("Return period", purchase.return_end_date ? date(purchase.return_start_date) + " - " + date(purchase.return_end_date) : "Not set");

  if (purchase.notes) section("Notes", [purchase.notes]);
  if (items?.length) section("Items", items.map((item) =>
    clean(item.name) + " - Qty " + clean(item.quantity) +
    (item.unit_price != null ? " - " + money(Number(item.unit_price), purchase.currency || "INR") + " / unit" : "") +
    (item.serial_number ? " - Serial " + clean(item.serial_number) : "") +
    (item.imei ? " - IMEI " + clean(item.imei) : "")
  ));
  if (payments?.length) section("Payments", payments.map((payment) =>
    money(Number(payment.amount), purchase.currency || "INR") + " - " + clean(payment.method) +
    (payment.paid_at ? " - " + new Date(payment.paid_at).toLocaleString("en-IN") : "") +
    (payment.reference ? " - " + clean(payment.reference) : "")
  ));
  if (warranties?.length) section("Warranty", warranties.map((warranty) =>
    date(warranty.start_date) + " - " + date(warranty.end_date) + " - " +
    clean(warranty.provider) + (warranty.notes ? " - " + clean(warranty.notes) : "")
  ));

  ensure(24);
  page.drawText("Generated by Rakhlo - reflects information stored at generation time.", {
    x: MARGIN, y: MARGIN, size: 7, font: regular, color: rgb(.53,.53,.5),
  });

  for (const document of documents ?? []) {
    const url = urls.get(document.id);
    if (!url) continue;
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const bytes = new Uint8Array(await response.arrayBuffer());

      if (document.mime_type === "application/pdf") {
        const source = await PDFDocument.load(bytes);
        const copied = await pdf.copyPages(source, source.getPageIndices());
        copied.forEach((sourcePage) => pdf.addPage(sourcePage));
        continue;
      }

      if (document.mime_type === "image/png" || document.mime_type === "image/jpeg") {
        const image = document.mime_type === "image/png"
          ? await pdf.embedPng(bytes)
          : await pdf.embedJpg(bytes);
        const assetPage = pdf.addPage(A4);
        const maxWidth = A4[0] - MARGIN * 2;
        const maxHeight = A4[1] - MARGIN * 2 - 24;
        const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        assetPage.drawText(clean(document.filename), { x: MARGIN, y: A4[1] - MARGIN, size: 9, font: bold });
        assetPage.drawImage(image, {
          x: (A4[0] - width) / 2,
          y: Math.max(MARGIN, (A4[1] - height) / 2 - 8),
          width,
          height,
        });
      }
    } catch {
      const assetPage = pdf.addPage(A4);
      assetPage.drawText(clean(document.filename), { x: MARGIN, y: A4[1] - MARGIN, size: 10, font: bold });
      assetPage.drawText("This attachment could not be embedded automatically.", {
        x: MARGIN, y: A4[1] - MARGIN - 28, size: 9, font: regular,
      });
    }
  }

  const bytes = await pdf.save();
  const filename = clean(purchase.title).replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "").slice(0, 80) || "purchase";
  return new NextResponse(bytes as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": (download ? "attachment" : "inline") + '; filename="' + filename + '-rakhlo.pdf"',
      "Cache-Control": "private, no-store",
    },
  });
}
