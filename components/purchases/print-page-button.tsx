"use client";

export function PrintPageButton() {
  return (
    <button type="button" onClick={() => window.print()} className="print-button">
      Print / Save PDF
    </button>
  );
}
