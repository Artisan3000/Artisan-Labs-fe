import "server-only";

import { del, get, head, type PutBlobResult } from "@vercel/blob";
import type { EmployeeIdentity } from "@/lib/academy-sso/session";
import { prisma } from "@/lib/prisma";
import { MAX_PDF_BYTES, deletePrivateBlobBestEffort } from "./blob";
import { activeReadyProfile, applicableValues, validId } from "./mutations";
import { OnboardingHttpError, requireAdmin } from "./security";

type AdminUpload =
  | { action: "CREATE"; operationId: string; categoryId: string; title: string; description: string | null; resourceType: "REFERENCE" | "SUBMISSION_FORM"; required: boolean; published: boolean }
  | { action: "REPLACE"; documentId: string; expectedVersion: number; requireResubmission: boolean };
type SubmissionUpload = { profileId: string; documentId: string; documentVersion: number; issuedAt: string };

function parseJson<T>(payload: string | null): T {
  try { if (!payload) throw new Error(); return JSON.parse(payload) as T; } catch { throw new OnboardingHttpError(400, "Invalid upload request."); }
}
function pdfPath(pathname: string, prefix: string) {
  if (!pathname.startsWith(prefix) || !/\.pdf$/i.test(pathname) || pathname.includes("..") || pathname.length > 500) throw new OnboardingHttpError(400, "Invalid PDF upload path.");
}
function cleanText(value: unknown, name: string, max: number, optional = false) {
  if (optional && (value === null || value === "")) return null;
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) throw new OnboardingHttpError(400, `Invalid ${name}.`);
  return value.trim();
}
function tokenOptions(payload: string) {
  return { allowedContentTypes: ["application/pdf"], maximumSizeInBytes: MAX_PDF_BYTES, addRandomSuffix: true, tokenPayload: payload };
}
async function verifyUploadedPdf(blob: PutBlobResult) {
  const metadata = await head(blob.url);
  if (metadata.size < 5 || metadata.size > MAX_PDF_BYTES || metadata.contentType !== "application/pdf") { await del(blob.url); throw new OnboardingHttpError(415, "Invalid PDF upload."); }
  const result = await get(blob.url, { access: "private", useCache: false, headers: { Range: "bytes=0-4" } });
  if (!result || result.statusCode !== 200) { await del(blob.url); throw new OnboardingHttpError(415, "Invalid PDF upload."); }
  const reader = result.stream.getReader(); const chunk = await reader.read(); await reader.cancel();
  const bytes = chunk.value?.slice(0, 5); const magic = bytes ? String.fromCharCode(...bytes) : "";
  if (magic !== "%PDF-") { await del(blob.url); throw new OnboardingHttpError(415, "Uploaded content is not a PDF."); }
  return metadata;
}

export async function authorizeAdminUpload(session: EmployeeIdentity, pathname: string, clientPayload: string | null) {
  requireAdmin(session);
  const input = parseJson<AdminUpload>(clientPayload);
  if (input.action === "CREATE") {
    if (!validId(input.operationId) || !validId(input.categoryId)) throw new OnboardingHttpError(400, "Invalid resource upload.");
    cleanText(input.title, "title", 200); cleanText(input.description, "description", 500, true);
    if (!["REFERENCE", "SUBMISSION_FORM"].includes(input.resourceType) || typeof input.required !== "boolean" || typeof input.published !== "boolean") throw new OnboardingHttpError(400, "Invalid resource upload.");
    if (!await prisma.resourceCategory.findUnique({ where: { id: input.categoryId }, select: { id: true } })) throw new OnboardingHttpError(404, "Resource category not found.");
    pdfPath(pathname, `onboarding/templates/${input.operationId}/`);
  } else if (input.action === "REPLACE") {
    if (!validId(input.documentId) || !Number.isInteger(input.expectedVersion) || input.expectedVersion < 1 || typeof input.requireResubmission !== "boolean") throw new OnboardingHttpError(400, "Invalid replacement upload.");
    const document = await prisma.resourceDocument.findFirst({ where: { id: input.documentId, type: "BLOB", archivedAt: null }, select: { version: true } });
    if (!document || document.version !== input.expectedVersion) throw new OnboardingHttpError(409, "Resource changed; reload before replacing it.");
    pdfPath(pathname, `onboarding/templates/${input.documentId}/`);
  } else throw new OnboardingHttpError(400, "Invalid upload action.");
  return tokenOptions(JSON.stringify(input));
}

export async function completeAdminUpload(blob: PutBlobResult, tokenPayload: string | null) {
  const input = parseJson<AdminUpload>(tokenPayload); const metadata = await verifyUploadedPdf(blob);
  if (input.action === "CREATE") {
    const slug = `upload-${input.operationId}`;
    try {
      const saved = await prisma.resourceDocument.upsert({ where: { slug }, update: {}, create: { categoryId: input.categoryId, slug, title: input.title.trim(), description: input.description?.trim() || null, type: "BLOB", kind: input.resourceType === "SUBMISSION_FORM" ? "FORM" : "REFERENCE", blobUrl: blob.url, blobPathname: blob.pathname, fileName: blob.pathname.split("/").pop()?.slice(0, 255) ?? "document.pdf", mimeType: "application/pdf", isRequired: input.required, isPublished: input.published } });
      if (saved.blobUrl !== blob.url) await deletePrivateBlobBestEffort(blob.url);
    } catch (error) { await deletePrivateBlobBestEffort(blob.url); throw error; }
    return;
  }
  const previous = await prisma.resourceDocument.findUnique({ where: { id: input.documentId } });
  if (!previous) { await deletePrivateBlobBestEffort(blob.url); return; }
  const nextVersion = input.expectedVersion + 1;
  const changed = await prisma.resourceDocument.updateMany({ where: { id: input.documentId, version: input.expectedVersion, archivedAt: null }, data: { blobUrl: blob.url, blobPathname: blob.pathname, fileName: blob.pathname.split("/").pop()?.slice(0, 255) ?? "document.pdf", mimeType: metadata.contentType, version: nextVersion, ...(input.requireResubmission && previous.kind === "FORM" ? { requiredSubmissionVersion: nextVersion } : {}) } });
  if (!changed.count) { await deletePrivateBlobBestEffort(blob.url); return; }
  await deletePrivateBlobBestEffort(previous.blobUrl);
}

export async function authorizeOwnSubmission(session: EmployeeIdentity, pathname: string, clientPayload: string | null) {
  const profile = await activeReadyProfile(session); const input = parseJson<{ documentId: string }>(clientPayload);
  if (!validId(input.documentId)) throw new OnboardingHttpError(404, "Submission form not found.");
  const document = await prisma.resourceDocument.findFirst({ where: { id: input.documentId, kind: "FORM", type: "BLOB", archivedAt: null, isPublished: true, category: { isPublished: true, applicability: { in: [...applicableValues(profile.employmentClassification!)] } } } });
  if (!document) throw new OnboardingHttpError(404, "Submission form not found.");
  pdfPath(pathname, `onboarding/submissions/${document.id}/`);
  const token: SubmissionUpload = { profileId: profile.id, documentId: document.id, documentVersion: document.version, issuedAt: new Date().toISOString() };
  return tokenOptions(JSON.stringify(token));
}

export async function authorizeAdminSubmission(session: EmployeeIdentity, profileId: string, pathname: string, clientPayload: string | null) {
  requireAdmin(session); if (!validId(profileId)) throw new OnboardingHttpError(404, "Profile not found.");
  const profile = await prisma.onboardingProfile.findUnique({ where: { id: profileId } }); const input = parseJson<{ documentId: string }>(clientPayload);
  if (!profile?.employmentClassification || !validId(input.documentId)) throw new OnboardingHttpError(404, "Submission form not found.");
  const document = await prisma.resourceDocument.findFirst({ where: { id: input.documentId, kind: "FORM", type: "BLOB", archivedAt: null, isPublished: true, category: { isPublished: true, applicability: { in: [...applicableValues(profile.employmentClassification)] } } } });
  if (!document) throw new OnboardingHttpError(404, "Submission form not found.");
  pdfPath(pathname, `onboarding/submissions/${document.id}/${profile.id}/`);
  return tokenOptions(JSON.stringify({ profileId, documentId: document.id, documentVersion: document.version, issuedAt: new Date().toISOString() } satisfies SubmissionUpload));
}

export async function completeSubmissionUpload(blob: PutBlobResult, tokenPayload: string | null) {
  const input = parseJson<SubmissionUpload>(tokenPayload); const metadata = await verifyUploadedPdf(blob);
  const uploadIssuedAt = new Date(input.issuedAt);
  if (!Number.isFinite(uploadIssuedAt.getTime())) {
    await deletePrivateBlobBestEffort(blob.url);
    return;
  }
  const profile = await prisma.onboardingProfile.findFirst({
    where: { id: input.profileId, isActive: true, employmentClassification: { not: null } },
    select: { id: true, employmentClassification: true },
  });
  const document = profile?.employmentClassification
    ? await prisma.resourceDocument.findFirst({
        where: {
          id: input.documentId,
          kind: "FORM",
          type: "BLOB",
          archivedAt: null,
          isPublished: true,
          version: input.documentVersion,
          category: {
            isPublished: true,
            applicability: { in: [...applicableValues(profile.employmentClassification)] },
          },
        },
        select: { id: true },
      })
    : null;
  const validPath =
    blob.pathname.startsWith(`onboarding/submissions/${input.documentId}/${input.profileId}/`) ||
    blob.pathname.startsWith(`onboarding/submissions/${input.documentId}/self/`);
  if (!document || !profile || !validPath) {
    await deletePrivateBlobBestEffort(blob.url);
    return;
  }

  const result = await prisma.$transaction(async (tx) => {
    // Serialize replacements for one employee/form pair so the displaced Blob
    // is always known and the database continues to point at the newest file.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`${input.profileId}:${input.documentId}`}, 0))`;
    const previous = await tx.resourceSubmission.findUnique({
      where: { profileId_documentId: { profileId: input.profileId, documentId: input.documentId } },
      select: { blobUrl: true, uploadIssuedAt: true },
    });
    if (previous && previous.uploadIssuedAt >= uploadIssuedAt) {
      return { accepted: false, previousUrl: null };
    }
    await tx.resourceSubmission.upsert({ where: { profileId_documentId: { profileId: input.profileId, documentId: input.documentId } }, update: { blobUrl: blob.url, blobPathname: blob.pathname, fileName: blob.pathname.split("/").pop()?.slice(0, 255) ?? "submission.pdf", sizeBytes: metadata.size, documentVersion: input.documentVersion, uploadIssuedAt, receivedAt: new Date() }, create: { profileId: input.profileId, documentId: input.documentId, blobUrl: blob.url, blobPathname: blob.pathname, fileName: blob.pathname.split("/").pop()?.slice(0, 255) ?? "submission.pdf", sizeBytes: metadata.size, documentVersion: input.documentVersion, uploadIssuedAt } });
    return { accepted: true, previousUrl: previous?.blobUrl ?? null };
  });
  if (!result.accepted) await deletePrivateBlobBestEffort(blob.url);
  else if (result.previousUrl !== blob.url) await deletePrivateBlobBestEffort(result.previousUrl);
}
