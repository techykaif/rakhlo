import { extensionForMimeType } from "@/lib/documents/validation";

export const PURCHASE_DOCUMENTS_BUCKET = "purchase-documents";

export function createDocumentStoragePath(
  userId: string,
  purchaseId: string,
  mimeType: string,
) {
  const extension = extensionForMimeType(mimeType);
  return userId + "/" + purchaseId + "/" + crypto.randomUUID() + "." + extension;
}

export function isOwnedPurchaseDocumentPath(
  path: string,
  userId: string,
  purchaseId: string,
) {
  return path.startsWith(userId + "/" + purchaseId + "/") && path.split("/").length === 3;
}

export function getDocumentBasename(path: string) {
  return path.split("/").at(-1) ?? "";
}
