import { listAdminMeetingAssignments, setAdminMeetingAssignment } from "@/lib/onboarding/mutations";
import { onboardingError, onboardingJson, requireJsonMutation, requireOnboardingSession } from "@/lib/onboarding/security";

export async function POST(
  request: Request,
  context: { params: Promise<{ profileId: string }> }
) {
  try {
    const session = await requireOnboardingSession();
    const body = await requireJsonMutation(request);
    const { profileId } = await context.params;
    return onboardingJson(await setAdminMeetingAssignment(session, profileId, body));
  } catch (error) {
    return onboardingError(error);
  }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ profileId: string }> }
) {
  try {
    const session = await requireOnboardingSession();
    const { profileId } = await context.params;
    return onboardingJson({ meetings: await listAdminMeetingAssignments(session, profileId) });
  } catch (error) {
    return onboardingError(error);
  }
}

export const dynamic = "force-dynamic";
