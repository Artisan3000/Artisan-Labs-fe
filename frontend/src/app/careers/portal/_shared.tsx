import { redirect } from "next/navigation";
import { isAcademySsoEnabled } from "@/lib/academy-sso/config";
import { getEmployeeSession } from "@/lib/academy-sso/session";
import { getOnboardingView } from "@/lib/onboarding/data";
import { isOnboardingEnabled } from "@/lib/onboarding/config";
import PortalShell from "@/components/onboarding/PortalShell";
import PortalState from "@/components/onboarding/PortalState";
import type { OnboardingView } from "@/components/onboarding/types";

const portalPreviewEnabled = process.env.NODE_ENV !== "production" && process.env.CAREERS_PORTAL_PREVIEW === "true";
const previewSession = { userId: "preview", name: "Preview Employee", email: "preview@artisanbarber.test", role: "EMPLOYEE" as const };

export async function loadPortal(previewProfileId?: string) {
  if (!portalPreviewEnabled && !isAcademySsoEnabled()) redirect("/careers");
  const session = portalPreviewEnabled ? previewSession : await getEmployeeSession();
  if (!session) redirect("/api/auth/academy/start");
  if (!isOnboardingEnabled()) {
    return {
      session,
      previewProfileId: undefined,
      result: {
        status: "disabled" as const,
        profile: { profileId: "", name: session.name, email: session.email, role: session.role, employmentType: null, startDate: null, trainingAccess: false, assistantStylistEligible: false, active: true },
        isPreview: false,
        progress: { completed: 0, total: 0, percent: 0, checklistCompleted: 0, checklistTotal: 0, meetingsCompleted: 0, meetingsTotal: 0, resourcesCompleted: 0, resourcesTotal: 0 },
        nextMeeting: null,
        checklistGroups: [], meetings: [], resourceCategories: [],
      },
    };
  }
  const permittedPreviewId = session.role === "ADMIN" ? previewProfileId : undefined;
  const result = await getOnboardingView({ session, previewProfileId: permittedPreviewId });
  return { session, result, previewProfileId: permittedPreviewId };
}

export function PortalBoundary({ session, result, previewProfileId, children }: { session: { role: "EMPLOYEE" | "ADMIN" }; result: { status: "disabled" | "pending" | "inactive" | "ready"; profile: OnboardingView["profile"]; isPreview: boolean }; previewProfileId?: string; children: React.ReactNode }) {
  return <PortalShell identity={result.profile} viewerRole={session.role} preview={result.isPreview} previewProfileId={result.isPreview ? previewProfileId : undefined}>
    {result.status === "disabled" ? <PortalState kind="empty" name={result.profile.name} /> : result.status === "pending" ? <PortalState kind="pending" name={result.profile.name} /> : result.status === "inactive" ? <PortalState kind="inactive" name={result.profile.name} /> : children}
  </PortalShell>;
}

export async function resolvePreview(searchParams: Promise<{ preview?: string | string[] }>) {
  const params = await searchParams;
  return typeof params.preview === "string" ? params.preview : undefined;
}
