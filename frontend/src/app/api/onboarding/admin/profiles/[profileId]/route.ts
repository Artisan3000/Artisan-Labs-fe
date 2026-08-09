import { updateAdminProfile } from "@/lib/onboarding/mutations";
import { onboardingError, onboardingJson, requireJsonMutation, requireOnboardingSession } from "@/lib/onboarding/security";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ profileId: string }> }
) {
  try {
    const session = await requireOnboardingSession();
    const body = await requireJsonMutation(request);
    const { profileId } = await context.params;
    return onboardingJson(await updateAdminProfile(session, profileId, body as Record<string, unknown>));
  } catch (error) {
    return onboardingError(error);
  }
}
