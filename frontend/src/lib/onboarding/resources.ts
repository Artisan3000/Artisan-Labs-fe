import "server-only";

import type { EmployeeIdentity } from "@/lib/academy-sso/session";
import { prisma } from "@/lib/prisma";
import { deletePrivateBlobBestEffort } from "./blob";
import { applicableValues, validId } from "./mutations";
import { OnboardingHttpError, requireAdmin, requireObjectWithOnlyKeys } from "./security";

function optionalText(value: unknown, name: string, max = 500) {
  if (value === null || value === "") return null;
  if (typeof value !== "string" || value.trim().length > max) throw new OnboardingHttpError(400, `Invalid ${name}.`);
  return value.trim();
}

export async function listAdminResources(session: EmployeeIdentity) {
  requireAdmin(session);
  const categories = await prisma.resourceCategory.findMany({ orderBy: { sortOrder: "asc" }, include: { documents: { where: { archivedAt: null }, orderBy: { sortOrder: "asc" }, include: { _count: { select: { submissions: true } } } } } });
  return {
    categories: categories.map(({ id, title, applicability }) => ({ id, title, applicability })),
    resources: categories.flatMap((category) => category.documents.map((document) => ({ id: document.id, categoryId: category.id, title: document.title, description: document.description, resourceType: document.kind === "FORM" ? "SUBMISSION_FORM" : "REFERENCE", required: document.isRequired, published: document.isPublished, version: document.version, hasTemplate: Boolean(document.blobUrl), submissionCount: document._count.submissions }))),
  };
}

export async function updateAdminResource(session: EmployeeIdentity, documentId: string, input: Record<string, unknown>) {
  requireAdmin(session); requireObjectWithOnlyKeys(input, ["categoryId", "title", "description", "resourceType", "required", "published"]);
  if (!validId(documentId)) throw new OnboardingHttpError(404, "Resource not found.");
  const existing = await prisma.resourceDocument.findFirst({
    where: { id: documentId, archivedAt: null },
    include: { _count: { select: { submissions: true } } },
  });
  if (!existing) throw new OnboardingHttpError(404, "Resource not found.");
  const title = input.title === undefined ? undefined : optionalText(input.title, "title", 200);
  if (title === null) throw new OnboardingHttpError(400, "Title is required.");
  const description = input.description === undefined ? undefined : optionalText(input.description, "description");
  const categoryId = input.categoryId === undefined ? undefined : validId(input.categoryId) ? input.categoryId : null;
  if (categoryId === null || (categoryId && !await prisma.resourceCategory.findUnique({ where: { id: categoryId }, select: { id: true } }))) throw new OnboardingHttpError(404, "Resource category not found.");
  const kind = input.resourceType === undefined ? undefined : input.resourceType === "REFERENCE" ? "REFERENCE" : input.resourceType === "SUBMISSION_FORM" ? "FORM" : null;
  if (kind === null) throw new OnboardingHttpError(400, "Invalid resource type.");
  if (kind === "FORM" && existing.type !== "BLOB") throw new OnboardingHttpError(409, "Only uploaded PDFs can require submission.");
  if (existing._count.submissions > 0 && kind !== undefined && kind !== existing.kind) {
    throw new OnboardingHttpError(409, "A form with employee submissions cannot change resource type.");
  }
  if (existing._count.submissions > 0 && categoryId !== undefined && categoryId !== existing.categoryId) {
    throw new OnboardingHttpError(409, "A form with employee submissions cannot move to another category.");
  }
  for (const field of ["required", "published"] as const) if (input[field] !== undefined && typeof input[field] !== "boolean") throw new OnboardingHttpError(400, `Invalid ${field} state.`);
  await prisma.resourceDocument.update({ where: { id: documentId }, data: { ...(categoryId !== undefined ? { categoryId } : {}), ...(title !== undefined ? { title } : {}), ...(description !== undefined ? { description } : {}), ...(kind !== undefined ? { kind } : {}), ...(input.required !== undefined ? { isRequired: input.required as boolean } : {}), ...(input.published !== undefined ? { isPublished: input.published as boolean } : {}) } });
  return { updated: true };
}

export async function deleteAdminResource(session: EmployeeIdentity, documentId: string) {
  requireAdmin(session);
  if (!validId(documentId)) throw new OnboardingHttpError(404, "Resource not found.");
  const document = await prisma.resourceDocument.findUnique({ where: { id: documentId }, include: { _count: { select: { submissions: true } } } });
  if (!document) throw new OnboardingHttpError(404, "Resource not found.");
  if (document._count.submissions > 0) await prisma.resourceDocument.update({ where: { id: documentId }, data: { isPublished: false, archivedAt: new Date(), blobUrl: null, blobPathname: null, fileName: null } });
  else await prisma.resourceDocument.delete({ where: { id: documentId } });
  await deletePrivateBlobBestEffort(document.blobUrl);
  return { deleted: true, retainedEmployeeRecords: document._count.submissions > 0 };
}

export async function getAdminSubmission(session: EmployeeIdentity, profileId: string, documentId: string) {
  requireAdmin(session);
  if (!validId(profileId) || !validId(documentId)) throw new OnboardingHttpError(404, "Submission not found.");
  const submission = await prisma.resourceSubmission.findUnique({ where: { profileId_documentId: { profileId, documentId } } });
  if (!submission) throw new OnboardingHttpError(404, "Submission not found.");
  return { submission };
}

export async function listAdminProfileResources(session: EmployeeIdentity, profileId: string) {
  requireAdmin(session);
  if (!validId(profileId)) throw new OnboardingHttpError(404, "Profile not found.");
  const profile = await prisma.onboardingProfile.findUnique({ where: { id: profileId } });
  if (!profile?.employmentClassification) throw new OnboardingHttpError(404, "Profile not found.");
  const documents = await prisma.resourceDocument.findMany({
    where: { kind: "FORM", category: { applicability: { in: [...applicableValues(profile.employmentClassification)] } }, OR: [{ archivedAt: null, isPublished: true }, { submissions: { some: { profileId } } }] },
    orderBy: { title: "asc" }, include: { submissions: { where: { profileId }, take: 1 } },
  });
  return documents.map((document) => { const submission = document.submissions[0]; return { id: document.id, title: document.title, submittedAt: submission?.receivedAt.toISOString() ?? null, resubmissionRequired: Boolean(submission && submission.documentVersion < document.requiredSubmissionVersion), submissionDownloadHref: submission ? `/api/onboarding/admin/profiles/${encodeURIComponent(profileId)}/resources/${encodeURIComponent(document.id)}/submission` : null }; });
}
