import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { createClient } from "@/lib/supabase/server";
import {
  DOCUMENT_MAX_BYTES,
  DOCUMENT_MAX_COUNT,
  DOCUMENT_MAX_TOTAL_BYTES,
} from "@/lib/documents/validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const A4: [number, number] = [595.28, 841.89];
const MARGIN = 48;
const require = createRequire(import.meta.url);

type FontPair = {
  regular: PDFFont;
  bold: PDFFont;
};

function clean(value: string | number | null | undefined) {
  const cleaned = String(value ?? "Not provided")
    .normalize("NFC")
    .replace(/[\p{Extended_Pictographic}\u200D\uFE0F]/gu, " ")
    .replace(/[→•·—]/g, "-")
    .replace(/[^\u0000-\u024F\u0900-\u097F\u2000-\u206F\u20B9]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || "Not provided";
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

function paymentDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
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

function isDevanagariRunCharacter(character: string) {
  return /\p{Script=Devanagari}/u.test(character) ||
    /\p{Mark}/u.test(character) ||
    character === "\u200C" ||
    character === "\u200D" ||
    character === "₹";
}

function splitTextByScript(text: string) {
  const safe = clean(text);
  const segments: Array<{ text: string; devanagari: boolean }> = [];
  let current = "";
  let currentDevanagari = false;

  for (const character of safe) {
    const devanagari = isDevanagariRunCharacter(character);
    if (current && devanagari !== currentDevanagari) {
      segments.push({ text: current, devanagari: currentDevanagari });
      current = "";
    }
    current += character;
    currentDevanagari = devanagari;
  }

  if (current) segments.push({ text: current, devanagari: currentDevanagari });
  return segments;
}

function drawText(
  page: PDFPage,
  text: string,
  options: {
    x: number;
    y: number;
    size: number;
    bold?: boolean;
    color?: ReturnType<typeof rgb>;
  },
  fonts: FontPair,
) {
  let x = options.x;

  for (const segment of splitTextByScript(text)) {
    const font = segment.devanagari
      ? (options.bold ? fonts.bold : fonts.regular)
      : (options.bold ? fonts.bold : fonts.regular);

    page.drawText(segment.text, {
      x,
      y: options.y,
      size: options.size,
      font,
      color: options.color,
    });

    x += font.widthOfTextAtSize(segment.text, options.size);
  }
}

async function embedFonts(pdf: PDFDocument): Promise<FontPair> {
  pdf.registerFontkit(fontkit);

  const [
    latinRegular,
    latinBold,
    devanagariRegular,
    devanagariBold,
  ] = await Promise.all([
    readFile(require.resolve("@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff2")),
    readFile(require.resolve("@fontsource/noto-sans/files/noto-sans-latin-700-normal.woff2")),
    readFile(require.resolve("@fontsource/noto-sans/files/noto-sans-devanagari-400-normal.woff2")),
    readFile(require.resolve("@fontsource/noto-sans/files/noto-sans-devanagari-700-normal.woff2")),
  ]);

  return {
    regular: await pdf.embedFont(latinRegular),
    bold: await pdf.embedFont(latinBold),
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const download = new URL(request.url).searchParams.get("download") === "1";
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims?.sub) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const userId = authData.claims.sub;
  const [
    { data: purchase, error: purchaseError },
    { data: documents, error: documentsError },
    { data: items, error: itemsError },
    { data: payments, error: paymentsError },
    { data: warranties, error: warrantiesError },
  ] = await Promise.all([
    supabase
      .from("purchases")
      .select("id,title,purchase_date,amount,currency,seller_name,quantity,status,notes,categories(name),return_start_date,return_end_date")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("documents")
      .select("id,type,storage_path,filename,mime_type,size_bytes,created_at")
      .eq("purchase_id", id)
      .eq("user_id", userId)
      .order("created_at"),
    supabase
      .from("purchase_items")
      .select("id,name,quantity,unit_price,serial_number,imei,notes,status")
      .eq("purchase_id", id)
      .eq("user_id", userId)
      .order("created_at"),
    supabase
      .from("payments")
      .select("id,amount,method,paid_at,reference,notes")
      .eq("purchase_id", id)
      .eq("user_id", userId)
      .order("paid_at", { ascending: false }),
    supabase
      .from("warranties")
      .select("id,start_date,end_date,provider,notes")
      .eq("purchase_id", id)
      .eq("user_id", userId)
      .order("end_date"),
  ]);

  if (purchaseError || documentsError || itemsError || paymentsError || warrantiesError) {
    return NextResponse.json({ error: "Unable to generate the purchase PDF." }, { status: 500 });
  }

  if (!purchase) {
    return NextResponse.json({ error: "Purchase not found." }, { status: 404 });
  }

  const documentCount = documents?.length ?? 0;
  const documentBytes = (documents ?? []).reduce(
    (total, document) => total + Number(document.size_bytes || 0),
    0,
  );

  if (documentCount > DOCUMENT_MAX_COUNT) {
    return NextResponse.json(
      { error: "This purchase has too many attachments to generate a PDF." },
      { status: 409 },
    );
  }

  if (documentBytes > DOCUMENT_MAX_TOTAL_BYTES) {
    return NextResponse.json(
      { error: "The stored attachments exceed the PDF generation size limit." },
      { status: 413 },
    );
  }

  const signed = documents?.length
    ? await supabase.storage.from("purchase-documents").createSignedUrls(
        documents.map((document) => document.storage_path), 600,
      )
    : { data: [], error: null };

  if (signed.error) {
    return NextResponse.json({ error: "Unable to prepare purchase attachments." }, { status: 500 });
  }

  const urls = new Map(
    (signed.data ?? []).map((entry, index) => [documents?.[index]?.id, entry.signedUrl]),
  );

  const pdf = await PDFDocument.create();
  pdf.setTitle(clean(purchase.title));
  pdf.setSubject("Rakhlo purchase record");
  pdf.setCreator("Rakhlo");

  let fonts: FontPair;
  try {
    fonts = await embedFonts(pdf);
  } catch {
    return NextResponse.json({ error: "PDF fonts could not be loaded." }, { status: 500 });
  }

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
    drawText(page, text, { x: MARGIN, y, size: 8, bold: true, color: rgb(.45,.45,.42) }, fonts);
    y -= 22;
  };
  const section = (title: string, lines: string[]) => {
    ensure(40);
    drawText(page, title, { x: MARGIN, y, size: 13, bold: true }, fonts);
    y -= 20;
    for (const line of lines) {
      for (const part of wrap(line)) {
        ensure(17);
        drawText(page, part, { x: MARGIN, y, size: 9 }, fonts);
        y -= 13;
      }
      y -= 5;
    }
  };

  drawText(page, "RAKHLO", { x: MARGIN, y, size: 10, bold: true }, fonts);
  y -= 28;
  heading("PURCHASE RECORD");
  for (const line of wrap(purchase.title, 54)) {
    ensure(30);
    drawText(page, line, { x: MARGIN, y, size: 24, bold: true }, fonts);
    y -= 28;
  }
  drawText(
    page,
    "Complete snapshot of the purchase and its stored documents.",
    { x: MARGIN, y, size: 9, color: rgb(.42,.42,.39) },
    fonts,
  );
  y -= 28;

  const labelValue = (label: string, value: string) => {
    ensure(34);
    drawText(page, label.toUpperCase(), { x: MARGIN, y, size: 7, bold: true, color: rgb(.48,.48,.45) }, fonts);
    y -= 13;
    for (const line of wrap(value, 64)) {
      drawText(page, line, { x: MARGIN, y, size: 10 }, fonts);
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
  labelValue(
    "Return period",
    purchase.return_end_date
      ? date(purchase.return_start_date) + " - " + date(purchase.return_end_date)
      : "Not set",
  );

  if (purchase.notes) section("Notes", [purchase.notes]);
  if (items?.length) {
    section(
      "Items",
      items.map((item) =>
        clean(item.name) + " - Qty " + clean(item.quantity) +
        (item.unit_price != null ? " - " + money(Number(item.unit_price), purchase.currency || "INR") + " / unit" : "") +
        (item.serial_number ? " - Serial " + clean(item.serial_number) : "") +
        (item.imei ? " - IMEI " + clean(item.imei) : "")
      ),
    );
  }
  if (payments?.length) {
    section(
      "Payments",
      payments.map((payment) =>
        money(Number(payment.amount), purchase.currency || "INR") + " - " + clean(payment.method) +
        (payment.paid_at ? " - " + paymentDateTime(payment.paid_at) : "") +
        (payment.reference ? " - " + clean(payment.reference) : "")
      ),
    );
  }
  if (warranties?.length) {
    section(
      "Warranty",
      warranties.map((warranty) =>
        date(warranty.start_date) + " - " + date(warranty.end_date) + " - " +
        clean(warranty.provider) + (warranty.notes ? " - " + clean(warranty.notes) : "")
      ),
    );
  }

  ensure(24);
  drawText(
    page,
    "Generated by Rakhlo - reflects information stored at generation time.",
    { x: MARGIN, y: MARGIN, size: 7, color: rgb(.53,.53,.5) },
    fonts,
  );

  let downloadedBytes = 0;

  for (const document of documents ?? []) {
    const url = urls.get(document.id);
    if (!url) continue;

    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const bytes = new Uint8Array(await response.arrayBuffer());

      if (
        bytes.byteLength > DOCUMENT_MAX_BYTES ||
        downloadedBytes + bytes.byteLength > DOCUMENT_MAX_TOTAL_BYTES
      ) {
        return NextResponse.json(
          { error: "The selected attachments are too large to include in this PDF." },
          { status: 413 },
        );
      }

      downloadedBytes += bytes.byteLength;

      if (document.mime_type === "application/pdf") {
        const source = await PDFDocument.load(bytes, { throwOnInvalidObject: false });
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

        drawText(
          assetPage,
          clean(document.filename),
          { x: MARGIN, y: A4[1] - MARGIN, size: 9, bold: true },
          fonts,
        );

        assetPage.drawImage(image, {
          x: (A4[0] - width) / 2,
          y: Math.max(MARGIN, (A4[1] - height) / 2 - 8),
          width,
          height,
        });
      }
    } catch {
      const assetPage = pdf.addPage(A4);
      drawText(
        assetPage,
        clean(document.filename),
        { x: MARGIN, y: A4[1] - MARGIN, size: 10, bold: true },
        fonts,
      );
      drawText(
        assetPage,
        "This attachment could not be embedded automatically.",
        { x: MARGIN, y: A4[1] - MARGIN - 28, size: 9 },
        fonts,
      );
    }
  }

  const bytes = await pdf.save();
  const filename = clean(purchase.title)
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "purchase";

  return new NextResponse(bytes as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": (download ? "attachment" : "inline") + '; filename="' + filename + '-rakhlo.pdf"',
      "Cache-Control": "private, no-store",
    },
  });
}
