import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const printStyles = [
  "@page { size: A4 portrait; margin: 14mm; }",
  "* { box-sizing: border-box; }",
  "body { margin: 0; background: #eee; color: #171713; font-family: Arial, Helvetica, sans-serif; }",
  ".print-document { padding: 32px 16px; }",
  ".print-toolbar { position: sticky; top: 0; z-index: 5; display: flex; gap: 16px; align-items: center; padding: 12px 16px; margin: -32px -16px 24px; background: #171713; color: white; font-size: 12px; }",
  ".print-button { border: 0; border-radius: 10px; padding: 10px 14px; font-weight: 800; cursor: pointer; }",
  ".print-page { width: min(210mm, 100%); min-height: 267mm; margin: 0 auto 20px; padding: 18mm; background: white; break-after: page; box-shadow: 0 10px 35px rgba(0,0,0,.08); }",
  ".print-page:last-child { break-after: auto; }",
  ".print-brand { font-weight: 900; letter-spacing: .18em; font-size: 11px; margin-bottom: 18mm; }",
  ".print-eyebrow { font-size: 9px; font-weight: 900; letter-spacing: .16em; color: #77786f; }",
  "h1 { font-size: 38px; line-height: 1; margin: 8px 0 12px; letter-spacing: -.04em; }",
  "h2 { font-size: 17px; margin: 0 0 8px; }",
  ".print-lede { font-size: 11px; line-height: 1.7; color: #6f7068; max-width: 640px; }",
  ".print-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-top: 24px; }",
  ".print-grid div { border-top: 1px solid #deddd6; padding-top: 8px; }",
  ".print-grid span, .print-list span { display: block; color: #77786f; font-size: 9px; line-height: 1.5; }",
  ".print-grid strong, .print-list strong { display: block; font-size: 11px; line-height: 1.5; }",
  ".print-section { margin-top: 18px; }",
  ".print-list { display: grid; gap: 8px; }",
  ".print-footer { margin-top: 24px; font-size: 8px; color: #898a82; }",
  ".print-document-index { display: grid; gap: 8px; margin-top: 24px; }",
  ".print-document-index a { display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; border-bottom: 1px solid #deddd6; color: inherit; text-decoration: none; }",
  ".print-document-index span { font-size: 9px; color: #77786f; }",
  ".print-page--asset { display: flex; flex-direction: column; gap: 10px; align-items: stretch; justify-content: center; }",
  ".print-page--asset img { display: block; width: 100%; max-height: 225mm; object-fit: contain; }",
  ".print-asset-label { font-size: 9px; font-weight: 800; color: #77786f; overflow-wrap: anywhere; }",
  ".print-pdf-placeholder { display: grid; place-items: center; min-height: 200mm; text-align: center; border: 1px dashed #c8c7bf; padding: 30px; }",
  ".print-pdf-placeholder p { max-width: 460px; font-size: 11px; line-height: 1.7; color: #6f7068; }",
  ".print-pdf-placeholder a { color: #171713; font-weight: 800; }",
  "@media (max-width: 700px) { .print-page { padding: 10mm; min-height: 267mm; } .print-grid { grid-template-columns: 1fr; } }",
  "@media print { body { background: white; } .no-print { display: none !important; } .print-document { padding: 0; } .print-page { width: auto; min-height: auto; margin: 0; box-shadow: none; padding: 0; } .print-page--summary { break-after: page; } .print-page--asset { min-height: 267mm; } .print-page--documents { break-after: page; } .print-pdf-placeholder { border: 0; } a { color: inherit; } }",
].join("\n");

export default async function PurchasePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: purchase }, { data: documents }, { data: items }, { data: payments }, { data: warranties }] =
    await Promise.all([
      supabase.from("purchases").select("id,title,purchase_date,amount,currency,seller_name,quantity,status,notes,categories(name),return_start_date,return_end_date,return_source,return_note").eq("id", id).maybeSingle(),
      supabase.from("documents").select("id,type,storage_path,filename,mime_type,size_bytes,created_at").eq("purchase_id", id).order("created_at"),
      supabase.from("purchase_items").select("id,name,quantity,unit_price,serial_number,imei,notes,status").eq("purchase_id", id).order("created_at"),
      supabase.from("payments").select("id,amount,method,paid_at,reference,notes").eq("purchase_id", id).order("paid_at", { ascending: false }),
      supabase.from("warranties").select("id,start_date,end_date,provider,source,notes").eq("purchase_id", id).order("end_date"),
    ]);

  if (!purchase) notFound();

  const signed = documents?.length
    ? await supabase.storage.from("purchase-documents").createSignedUrls(documents.map((document) => document.storage_path), 600)
    : { data: [] };

  const urls = new Map((signed.data ?? []).map((entry, index) => [documents?.[index]?.id, entry.signedUrl]));

  const money = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: purchase.currency || "INR",
    maximumFractionDigits: 2,
  });

  const date = (value: string | null) =>
    value
      ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(value + "T00:00:00Z"))
      : "—";

  return (
    <main className="print-document">
      <div className="print-toolbar no-print">
        <button type="button" onClick={() => window.print()} className="print-button">Print / Save PDF</button>
        <span>Use your browser's Print dialog and choose “Save as PDF”.</span>
      </div>

      <section className="print-page">
        <div className="print-brand">RAKHLO</div>
        <div className="print-eyebrow">PURCHASE RECORD</div>
        <h1>{purchase.title}</h1>
        <p className="print-lede">A complete snapshot of this purchase and the information you chose to keep with it.</p>

        <div className="print-grid">
          <div><span>Purchase date</span><strong>{date(purchase.purchase_date)}</strong></div>
          <div><span>Amount</span><strong>{money.format(Number(purchase.amount))}</strong></div>
          <div><span>Quantity</span><strong>{purchase.quantity}</strong></div>
          <div><span>Seller</span><strong>{purchase.seller_name || "Not provided"}</strong></div>
          <div><span>Category</span><strong>{purchase.categories?.name || "Not provided"}</strong></div>
          <div><span>Status</span><strong>{purchase.status}</strong></div>
          <div><span>Return period</span><strong>{purchase.return_end_date ? date(purchase.return_start_date) + " → " + date(purchase.return_end_date) : "Not set"}</strong></div>
        </div>

        {purchase.notes ? <div className="print-section"><h2>Notes</h2><p>{purchase.notes}</p></div> : null}

        {items?.length ? (
          <div className="print-section">
            <h2>Items</h2>
            <div className="print-list">
              {items.map((item) => (
                <div key={item.id}>
                  <strong>{item.name}</strong>
                  <span>Qty {item.quantity}{item.unit_price != null ? " · " + money.format(Number(item.unit_price)) + " / unit" : ""}{item.serial_number ? " · Serial " + item.serial_number : ""}{item.imei ? " · IMEI " + item.imei : ""}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {payments?.length ? (
          <div className="print-section">
            <h2>Payments</h2>
            <div className="print-list">
              {payments.map((payment) => (
                <div key={payment.id}>
                  <strong>{money.format(Number(payment.amount))} · {payment.method}</strong>
                  <span>{payment.paid_at ? new Date(payment.paid_at).toLocaleString("en-IN") : "Date not provided"}{payment.reference ? " · " + payment.reference : ""}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {warranties?.length ? (
          <div className="print-section">
            <h2>Warranty</h2>
            <div className="print-list">
              {warranties.map((warranty) => (
                <div key={warranty.id}>
                  <strong>{date(warranty.start_date)} → {date(warranty.end_date)}</strong>
                  <span>{warranty.provider || "Provider not provided"}{warranty.notes ? " · " + warranty.notes : ""}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <p className="print-footer">Generated by Rakhlo · This document reflects the information stored at print time.</p>
      </section>

      {documents?.length ? (
        <section className="print-page">
          <div className="print-eyebrow">ATTACHED PROOF</div>
          <h2>Uploaded documents</h2>
          <p className="print-lede">Each image is given its own printable page. Original PDFs are preserved and linked as the original file.</p>
          <div className="print-document-index">
            {documents.map((document) => (
              <a key={document.id} href={urls.get(document.id) ?? "#"} target="_blank" rel="noreferrer">
                <strong>{document.filename}</strong>
                <span>{document.type} · {document.mime_type}</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {documents?.map((document) => {
        const url = urls.get(document.id);
        if (!url) return null;

        if (document.mime_type.startsWith("image/")) {
          return (
            <section className="print-page print-page--asset" key={document.id}>
              <div className="print-asset-label">{document.filename}</div>
              <img src={url} alt={document.filename} />
            </section>
          );
        }

        return (
          <section className="print-page" key={document.id}>
            <div className="print-asset-label">{document.filename}</div>
            <div className="print-pdf-placeholder">
              <h2>Original PDF attached</h2>
              <p>The PDF is intentionally not re-rendered or compressed. Open the original file from the link above to print its pages at full fidelity.</p>
              <a href={url} target="_blank" rel="noreferrer">Open original PDF</a>
            </div>
          </section>
        );
      })}

      <style>{printStyles}</style>
    </main>
  );
}
