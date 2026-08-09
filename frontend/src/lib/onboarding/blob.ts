import "server-only";

import { del, issueSignedToken, presignUrl } from "@vercel/blob";

export const MAX_PDF_BYTES = 20 * 1024 * 1024;

export async function deletePrivateBlobBestEffort(url: string | null | undefined) {
  if (!url) return;
  try { await del(url); } catch (error) { console.error("Private Blob cleanup failed", error); }
}

export async function privateDownloadUrl(pathname: string) {
  const validUntil = Date.now() + 5 * 60 * 1000;
  const token = await issueSignedToken({ pathname, operations: ["get"], validUntil });
  return (await presignUrl(token, { access: "private", operation: "get", pathname, validUntil })).presignedUrl;
}
