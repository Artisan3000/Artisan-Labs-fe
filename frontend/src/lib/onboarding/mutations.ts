import "server-only";

import type { EmployeeIdentity } from "@/lib/academy-sso/session";
import { prisma } from "@/lib/prisma";
import { syncOnboardingProfile } from "./data";
import { OnboardingHttpError, requireAdmin, requireObjectWithOnlyKeys } from "./security";

export function validId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(value);
}
export function applicableValues(classification: "W2" | "CONTRACTOR_1099") {
  return ["ALL", classification] as const;
}
export async function activeReadyProfile(session: EmployeeIdentity) {
  const profile = await syncOnboardingProfile(session);
  if (!profile.isActive) throw new OnboardingHttpError(403, "Onboarding profile is inactive.");
  if (!profile.employmentClassification) throw new OnboardingHttpError(409, "Onboarding setup is pending.");
  return profile;
}

export async function setChecklistCompletion(session: EmployeeIdentity, input: { itemId: unknown; completed: unknown }) {
  requireObjectWithOnlyKeys(input, ["itemId", "completed"]);
  if (!validId(input.itemId) || typeof input.completed !== "boolean") throw new OnboardingHttpError(400, "Invalid checklist update.");
  const profile = await activeReadyProfile(session);
  const item = await prisma.checklistItem.findFirst({ where: { id: input.itemId, isActive: true, group: { isActive: true }, applicability: { in: [...applicableValues(profile.employmentClassification!)] } }, select: { id: true } });
  if (!item) throw new OnboardingHttpError(404, "Checklist item not found.");
  if (input.completed) await prisma.checklistCompletion.upsert({ where: { profileId_itemId: { profileId: profile.id, itemId: item.id } }, update: { completedAt: new Date() }, create: { profileId: profile.id, itemId: item.id } });
  else await prisma.checklistCompletion.deleteMany({ where: { profileId: profile.id, itemId: item.id } });
  return { completed: input.completed };
}

export async function listAdminMeetingAssignments(session: EmployeeIdentity, profileId: string) {
  requireAdmin(session);
  if (!validId(profileId)) throw new OnboardingHttpError(404, "Profile not found.");
  const profile = await prisma.onboardingProfile.findUnique({ where: { id: profileId }, include: { meetingAssignments: { select: { meetingId: true, scheduledAt: true, hostDisplayName: true, completedAt: true } } } });
  if (!profile) throw new OnboardingHttpError(404, "Profile not found.");
  const applicability = profile.employmentClassification ? [...applicableValues(profile.employmentClassification)] : ["ALL" as const];
  const meetings = await prisma.meeting.findMany({ where: { isActive: true, applicability: { in: applicability }, OR: [{ requiresAssistantStylist: false }, { requiresAssistantStylist: profile.assistantStylistEligible }] }, orderBy: { sortOrder: "asc" }, select: { id: true, title: true, durationMinutes: true } });
  const assigned = new Map(profile.meetingAssignments.map((item) => [item.meetingId, item]));
  return meetings.map((meeting) => { const assignment = assigned.get(meeting.id); return { ...meeting, assigned: Boolean(assignment), scheduledAt: assignment?.scheduledAt?.toISOString() ?? null, hostName: assignment?.hostDisplayName ?? null, completed: Boolean(assignment?.completedAt) }; });
}

async function visibleDocument(profileId: string, classification: "W2" | "CONTRACTOR_1099", documentId: string) {
  const document = await prisma.resourceDocument.findFirst({ where: { id: documentId, archivedAt: null, isPublished: true, category: { isPublished: true, applicability: { in: [...applicableValues(classification)] } } } });
  if (!document) throw new OnboardingHttpError(404, "Resource not found.");
  return { profileId, document };
}

export async function setResourceCompletion(session: EmployeeIdentity, input: { documentId: unknown; completed: unknown }) {
  requireObjectWithOnlyKeys(input, ["documentId", "completed"]);
  if (!validId(input.documentId) || typeof input.completed !== "boolean") throw new OnboardingHttpError(400, "Invalid resource update.");
  const profile = await activeReadyProfile(session);
  const visible = await visibleDocument(profile.id, profile.employmentClassification!, input.documentId);
  if (visible.document.kind !== "REFERENCE") throw new OnboardingHttpError(409, "Forms are completed by submitting them.");
  if (input.completed) {
    const progress = await prisma.resourceProgress.findUnique({ where: { profileId_documentId: { profileId: profile.id, documentId: visible.document.id } }, select: { firstOpenedAt: true } });
    if (!progress?.firstOpenedAt) throw new OnboardingHttpError(409, "Open the resource before marking it complete.");
  }
  await prisma.resourceProgress.upsert({ where: { profileId_documentId: { profileId: profile.id, documentId: visible.document.id } }, update: { completedAt: input.completed ? new Date() : null, completedVersion: input.completed ? visible.document.version : null }, create: { profileId: profile.id, documentId: visible.document.id, completedAt: input.completed ? new Date() : null, completedVersion: input.completed ? visible.document.version : null } });
  return { completed: input.completed, version: visible.document.version };
}

export async function openResource(session: EmployeeIdentity, documentId: string) {
  if (!validId(documentId)) throw new OnboardingHttpError(404, "Resource not found.");
  const profile = await activeReadyProfile(session);
  const visible = await visibleDocument(profile.id, profile.employmentClassification!, documentId);
  if (visible.document.type === "BLOB" && (!visible.document.blobUrl || !visible.document.fileName)) throw new OnboardingHttpError(404, "Resource not found.");
  if (visible.document.type === "EXTERNAL_LINK") {
    if (!visible.document.externalUrl) throw new OnboardingHttpError(404, "Resource not found.");
    let target: URL; try { target = new URL(visible.document.externalUrl); } catch { throw new OnboardingHttpError(404, "Resource not found."); }
    if (target.protocol !== "https:" || target.username || target.password || target.hash) throw new OnboardingHttpError(404, "Resource not found.");
  }
  const now = new Date();
  await prisma.resourceProgress.upsert({ where: { profileId_documentId: { profileId: profile.id, documentId: visible.document.id } }, update: { lastOpenedAt: now }, create: { profileId: profile.id, documentId: visible.document.id, firstOpenedAt: now, lastOpenedAt: now } });
  return visible.document;
}

export async function updateAdminProfile(session: EmployeeIdentity, profileId: string, input: Record<string, unknown>) {
  requireAdmin(session); requireObjectWithOnlyKeys(input, ["employmentType", "startDate", "trainingAccess", "assistantStylistEligible", "active"]);
  if (!validId(profileId)) throw new OnboardingHttpError(404, "Profile not found.");
  const classification = input.employmentType;
  if (classification !== undefined && classification !== null && classification !== "W2" && classification !== "CONTRACTOR_1099") throw new OnboardingHttpError(400, "Invalid employment classification.");
  for (const key of ["trainingAccess", "assistantStylistEligible", "active"] as const) if (input[key] !== undefined && typeof input[key] !== "boolean") throw new OnboardingHttpError(400, `Invalid ${key}.`);
  let startDate: Date | null | undefined;
  if (input.startDate === null) startDate = null;
  else if (typeof input.startDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input.startDate)) { startDate = new Date(`${input.startDate}T00:00:00.000Z`); if (Number.isNaN(startDate.valueOf()) || startDate.toISOString().slice(0, 10) !== input.startDate) throw new OnboardingHttpError(400, "Invalid start date."); }
  else if (input.startDate !== undefined) throw new OnboardingHttpError(400, "Invalid start date.");
  const existing = await prisma.onboardingProfile.findUnique({ where: { id: profileId } });
  if (!existing) throw new OnboardingHttpError(404, "Profile not found.");
  const nextClassification = classification === undefined ? existing.employmentClassification : classification;
  const nextAssistant = input.assistantStylistEligible === undefined ? existing.assistantStylistEligible : input.assistantStylistEligible as boolean;
  await prisma.$transaction(async (tx) => {
    await tx.onboardingProfile.update({ where: { id: profileId }, data: { ...(classification !== undefined ? { employmentClassification: classification } : {}), ...(startDate !== undefined ? { startDate } : {}), ...(input.trainingAccess !== undefined ? { trainingAccess: input.trainingAccess as boolean } : {}), ...(input.assistantStylistEligible !== undefined ? { assistantStylistEligible: input.assistantStylistEligible as boolean } : {}), ...(input.active !== undefined ? { isActive: input.active as boolean } : {}) } });
    if (nextClassification && (classification !== undefined || input.assistantStylistEligible !== undefined)) {
      const active = await tx.meeting.findMany({ where: { isActive: true, applicability: { in: [...applicableValues(nextClassification)] }, OR: [{ requiresAssistantStylist: false }, { requiresAssistantStylist: nextAssistant }] }, select: { id: true } });
      const ids = active.map(({ id }) => id);
      await tx.meetingAssignment.deleteMany({ where: { profileId, completedAt: null, meetingId: { notIn: ids } } });
      for (const { id } of active) await tx.meetingAssignment.upsert({ where: { profileId_meetingId: { profileId, meetingId: id } }, update: {}, create: { profileId, meetingId: id } });
    }
  });
  return { updated: true };
}

export async function setAdminMeetingAssignment(session: EmployeeIdentity, profileId: string, input: Record<string, unknown>) {
  requireAdmin(session); requireObjectWithOnlyKeys(input, ["meetingId", "assigned", "scheduledAt", "hostDisplayName", "completed"]);
  if (!validId(profileId) || !validId(input.meetingId) || typeof input.assigned !== "boolean" || typeof input.completed !== "boolean") throw new OnboardingHttpError(400, "Invalid meeting assignment.");
  const scheduledAt = input.scheduledAt === null || input.scheduledAt === "" ? null : typeof input.scheduledAt === "string" ? new Date(input.scheduledAt) : undefined;
  if (scheduledAt === undefined || (scheduledAt && Number.isNaN(scheduledAt.valueOf()))) throw new OnboardingHttpError(400, "Invalid meeting date.");
  const host = input.hostDisplayName === null || input.hostDisplayName === "" ? null : typeof input.hostDisplayName === "string" ? input.hostDisplayName.trim() : undefined;
  if (host === undefined || (host && host.length > 120)) throw new OnboardingHttpError(400, "Invalid host name.");
  if ((scheduledAt === null) !== (host === null)) throw new OnboardingHttpError(400, "Meeting date and host must be set together.");
  const [profile, meeting] = await Promise.all([prisma.onboardingProfile.findUnique({ where: { id: profileId } }), prisma.meeting.findFirst({ where: { id: input.meetingId, isActive: true } })]);
  if (!profile?.employmentClassification || !meeting) throw new OnboardingHttpError(404, "Profile or meeting not found.");
  if (!applicableValues(profile.employmentClassification).includes(meeting.applicability) || (meeting.requiresAssistantStylist && !profile.assistantStylistEligible)) throw new OnboardingHttpError(409, "Meeting does not apply to this profile.");
  if (!input.assigned) { await prisma.meetingAssignment.deleteMany({ where: { profileId, meetingId: meeting.id } }); return { assigned: false }; }
  await prisma.meetingAssignment.upsert({ where: { profileId_meetingId: { profileId, meetingId: meeting.id } }, update: { scheduledAt, hostDisplayName: host, completedAt: input.completed ? new Date() : null }, create: { profileId, meetingId: meeting.id, scheduledAt, hostDisplayName: host, completedAt: input.completed ? new Date() : null } });
  return { assigned: true, scheduledAt: scheduledAt?.toISOString() ?? null, hostName: host, completed: input.completed };
}

export async function setAdminChecklistCompletion(session: EmployeeIdentity, profileId: string, input: { itemId?: unknown; completed?: unknown }) {
  requireAdmin(session); requireObjectWithOnlyKeys(input, ["itemId", "completed"]);
  if (!validId(profileId) || !validId(input.itemId) || typeof input.completed !== "boolean") throw new OnboardingHttpError(400, "Invalid checklist update.");
  const profile = await prisma.onboardingProfile.findUnique({ where: { id: profileId } });
  if (!profile?.employmentClassification) throw new OnboardingHttpError(404, "Profile not found or setup pending.");
  const item = await prisma.checklistItem.findFirst({ where: { id: input.itemId, isActive: true, group: { isActive: true }, applicability: { in: [...applicableValues(profile.employmentClassification)] } }, select: { id: true } });
  if (!item) throw new OnboardingHttpError(404, "Checklist item not found.");
  if (input.completed) await prisma.checklistCompletion.upsert({ where: { profileId_itemId: { profileId, itemId: item.id } }, update: { completedAt: new Date() }, create: { profileId, itemId: item.id } });
  else await prisma.checklistCompletion.deleteMany({ where: { profileId, itemId: item.id } });
  return { completed: input.completed };
}
