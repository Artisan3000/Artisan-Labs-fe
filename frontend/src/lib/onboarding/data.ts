import "server-only";

import type { EmployeeIdentity } from "@/lib/academy-sso/session";
import type {
  AdminProfileSummary,
  ChecklistGroupView,
  OnboardingView,
  ResourceCategoryView,
} from "@/components/onboarding/types";
import { prisma } from "@/lib/prisma";
import { calculateProgress, formSubmissionIsComplete, meetingStatus, resourceIsComplete } from "./domain";
import { OnboardingHttpError, requireAdmin } from "./security";

export async function syncOnboardingProfile(session: EmployeeIdentity) {
  return prisma.onboardingProfile.upsert({
    where: { academyUserId: session.userId },
    update: { displayName: session.name, email: session.email },
    create: {
      academyUserId: session.userId,
      displayName: session.name,
      email: session.email,
    },
  });
}

export async function syncIdentityIfOnboardingEnabled(session: EmployeeIdentity) {
  if (process.env.ARTISAN_ONBOARDING_ENABLED !== "true") return;
  await syncOnboardingProfile(session);
}

async function resolveProfile(
  session: EmployeeIdentity,
  previewProfileId?: string
) {
  if (!previewProfileId) return syncOnboardingProfile(session);
  requireAdmin(session);
  const profile = await prisma.onboardingProfile.findUnique({
    where: { id: previewProfileId },
  });
  if (!profile) throw new OnboardingHttpError(404, "Profile not found.");
  return profile;
}

export async function getOnboardingView({
  session,
  previewProfileId,
}: {
  session: EmployeeIdentity;
  previewProfileId?: string;
}) {
  const profile = await resolveProfile(session, previewProfileId);
  const isPreview = Boolean(previewProfileId);
  const identity = {
    profileId: profile.id,
    name: profile.displayName,
    email: profile.email,
    role: session.role,
    employmentType: profile.employmentClassification,
    startDate: profile.startDate?.toISOString() ?? null,
    trainingAccess: profile.trainingAccess,
    assistantStylistEligible: profile.assistantStylistEligible,
    active: profile.isActive,
  };
  const base = {
    viewerRole: session.role,
    profile: identity,
    isPreview,
    progress: {
      completed: 0, total: 0, percent: 0,
      checklistCompleted: 0, checklistTotal: 0,
      meetingsCompleted: 0, meetingsTotal: 0,
      resourcesCompleted: 0, resourcesTotal: 0,
    },
    nextMeeting: null,
    checklistGroups: [],
    meetings: [],
    resourceCategories: [],
  };
  if (!profile.isActive) return { status: "inactive" as const, ...base };
  if (!profile.employmentClassification) {
    return { status: "pending" as const, ...base };
  }

  const applicable = ["ALL", profile.employmentClassification] as const;
  const [groups, assignments, categories] = await Promise.all([
    prisma.checklistGroup.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        items: {
          where: { isActive: true, applicability: { in: [...applicable] } },
          orderBy: { sortOrder: "asc" },
          include: {
            completions: { where: { profileId: profile.id }, take: 1 },
          },
        },
      },
    }),
    prisma.meetingAssignment.findMany({
      where: {
        profileId: profile.id,
        meeting: {
          isActive: true,
          applicability: { in: [...applicable] },
          OR: [
            { requiresAssistantStylist: false },
            { requiresAssistantStylist: profile.assistantStylistEligible },
          ],
        },
      },
      orderBy: { meeting: { sortOrder: "asc" } },
      include: {
        meeting: true,
      },
    }),
    prisma.resourceCategory.findMany({
      where: {
        isPublished: true,
        applicability: { in: [...applicable] },
      },
      orderBy: { sortOrder: "asc" },
      include: {
        documents: {
          where: { isPublished: true },
          orderBy: { sortOrder: "asc" },
          include: {
            progress: { where: { profileId: profile.id }, take: 1 },
            submissions: { where: { profileId: profile.id }, take: 1 },
          },
        },
      },
    }),
  ]);

  const checklistGroups: ChecklistGroupView[] = groups
    .filter((group) => group.items.length > 0)
    .map((group) => ({
      id: group.id,
      title: group.title,
      subtitle: group.subtitle,
      items: group.items.map((item) => ({
        id: item.id,
        label: item.label,
        completed: item.completions.length > 0,
        readOnly: isPreview,
        source: "MANUAL" as const,
      })),
    }));
  const meetings = assignments.map((assignment, index) => ({
    id: assignment.meeting.id,
    ordinal: String(index + 1).padStart(2, "0"),
    title: assignment.meeting.title,
    description: assignment.meeting.description,
    durationMinutes: assignment.meeting.durationMinutes,
    status: meetingStatus(assignment),
    scheduledAt: assignment.scheduledAt?.toISOString() ?? null,
    hostName: assignment.hostDisplayName,
  }));
  const meetingChecklistGroup: ChecklistGroupView = {
    id: "required-meetings-projection",
    title: "Required meetings",
    subtitle: "Tracked automatically from your meeting journey.",
    items: meetings.map((meeting) => ({
      id: `meeting:${meeting.id}`,
      label: `Attend ${meeting.title}${meeting.title === "Assistant Stylist Program" ? " (your role)" : ""}`,
      completed: meeting.status === "COMPLETED",
      readOnly: true,
      source: "MEETING" as const,
    })),
  };
  const trainingGroupIndex = checklistGroups.findIndex(
    (group) => group.title === "External training access"
  );
  const checklistGroupsWithMeetings = meetingChecklistGroup.items.length
    ? [
        ...checklistGroups.slice(0, trainingGroupIndex < 0 ? checklistGroups.length : trainingGroupIndex),
        meetingChecklistGroup,
        ...checklistGroups.slice(trainingGroupIndex < 0 ? checklistGroups.length : trainingGroupIndex),
      ]
    : checklistGroups;
  const resources: ResourceCategoryView[] = categories.map((category) => {
    const article = category.articleContent as {
      eyebrow?: unknown;
      intro?: unknown;
      introduction?: unknown;
      sections?: unknown;
    } | null;
    const sections = Array.isArray(article?.sections)
      ? article.sections.flatMap((section, index) => {
          if (!section || typeof section !== "object") return [];
          const value = section as { heading?: unknown; body?: unknown };
          return typeof value.heading === "string" && typeof value.body === "string"
            ? [{ id: `${category.id}-${index}`, heading: value.heading, body: value.body }]
            : [];
        })
      : [];
    return {
    id: category.id,
    slug: category.slug,
    title: category.title,
    eyebrow: typeof article?.eyebrow === "string" ? article.eyebrow : null,
    introduction:
      typeof article?.introduction === "string"
        ? article.introduction
        : typeof article?.intro === "string"
          ? article.intro
          : category.description,
    sections,
    documents: category.documents.map((document) => {
      const progress = document.progress[0];
      const submission = document.submissions[0];
      const formComplete = document.kind === "FORM" && formSubmissionIsComplete({ submittedVersion: submission?.documentVersion ?? null, requiredSubmissionVersion: document.requiredSubmissionVersion });
      return {
        id: document.id,
        title: document.title,
        description: document.description,
        kind: document.type === "BLOB" ? "FILE" as const : "LINK" as const,
        resourceType: document.kind === "FORM" ? "SUBMISSION_FORM" as const : "REFERENCE" as const,
        href: `/api/onboarding/resources/${encodeURIComponent(document.id)}/open`,
        required: document.isRequired,
        version: String(document.version),
        opened: Boolean(progress?.firstOpenedAt),
        completed: document.kind === "FORM" ? formComplete : resourceIsComplete({
          version: document.version, completedAt: progress?.completedAt ?? null,
          completedVersion: progress?.completedVersion ?? null,
        }),
        submittedAt: submission?.receivedAt.toISOString() ?? null,
        resubmissionRequired: document.kind === "FORM" && Boolean(submission) && !formComplete,
      };
    }),
    };
  });
  const manualChecklistUnits = checklistGroups.flatMap((group) => group.items);
  const displayedChecklistUnits = checklistGroupsWithMeetings.flatMap((group) => group.items);
  const meetingUnits = meetings.map((meeting) => ({ completed: meeting.status === "COMPLETED" }));
  const resourceUnits = resources.flatMap((category) =>
    category.documents.filter((document) => document.required)
  );
  const progress = calculateProgress({
    checklist: manualChecklistUnits,
    meetings: meetingUnits,
    requiredResources: resourceUnits,
  });
  const fullProgress = {
    ...progress,
    checklistCompleted: displayedChecklistUnits.filter((item) => item.completed).length,
    checklistTotal: displayedChecklistUnits.length,
    meetingsCompleted: meetingUnits.filter((item) => item.completed).length,
    meetingsTotal: meetingUnits.length,
    resourcesCompleted: resourceUnits.filter((item) => item.completed).length,
    resourcesTotal: resourceUnits.length,
  };

  return {
    status: "ready" as const,
    viewerRole: session.role,
    profile: identity,
    isPreview,
    progress: fullProgress,
    nextMeeting: meetings.find((meeting) => meeting.status !== "COMPLETED") ?? null,
    checklistGroups: checklistGroupsWithMeetings,
    meetings,
    resourceCategories: resources,
  } satisfies OnboardingView & { status: "ready" };
}

export async function listAdminProfiles(session: EmployeeIdentity): Promise<AdminProfileSummary[]> {
  requireAdmin(session);
  await syncOnboardingProfile(session);
  const profiles = await prisma.onboardingProfile.findMany({
    orderBy: [{ isActive: "desc" }, { displayName: "asc" }],
    select: {
      id: true,
      displayName: true,
      email: true,
      employmentClassification: true,
      startDate: true,
      trainingAccess: true,
      assistantStylistEligible: true,
      isActive: true,
    },
  });
  return Promise.all(profiles.map(async (profile) => {
    const view = await getOnboardingView({ session, previewProfileId: profile.id });
    return {
      profileId: profile.id,
      name: profile.displayName,
      email: profile.email,
      employmentType: profile.employmentClassification,
      active: profile.isActive,
      startDate: profile.startDate?.toISOString() ?? null,
      progressPercent: view.status === "ready" ? view.progress.percent : null,
      trainingAccess: profile.trainingAccess,
      assistantStylistEligible: profile.assistantStylistEligible,
    };
  }));
}

export async function getAdminProfileDetail(
  session: EmployeeIdentity,
  profileId: string
) {
  requireAdmin(session);
  const view = await getOnboardingView({ session, previewProfileId: profileId });
  const meetingTemplates = await prisma.meeting.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      title: true,
      durationMinutes: true,
      applicability: true,
      requiresAssistantStylist: true,
      assignments: {
        where: { profileId },
        select: { id: true, completedAt: true, scheduledAt: true, hostDisplayName: true },
        take: 1,
      },
    },
  });
  return {
    view,
    meetingTemplates: meetingTemplates.map((meeting) => ({
      id: meeting.id,
      title: meeting.title,
      durationMinutes: meeting.durationMinutes,
      applicability: meeting.applicability,
      requiresAssistantStylist: meeting.requiresAssistantStylist,
      assigned: meeting.assignments.length > 0,
      completed: Boolean(meeting.assignments[0]?.completedAt),
      scheduledAt: meeting.assignments[0]?.scheduledAt?.toISOString() ?? null,
      hostName: meeting.assignments[0]?.hostDisplayName ?? null,
    })),
  };
}
