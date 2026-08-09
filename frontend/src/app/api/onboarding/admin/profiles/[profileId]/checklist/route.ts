import { setAdminChecklistCompletion } from "@/lib/onboarding/mutations";
import { onboardingError, onboardingJson, requireJsonMutation, requireOnboardingSession } from "@/lib/onboarding/security";

export async function POST(
  request: Request,
  context: { params: Promise<{ profileId: string }> }
) {
  try {
    const session = await requireOnboardingSession();
    const body = await requireJsonMutation(request);
    const { profileId } = await context.params;
    return onboardingJson(await setAdminChecklistCompletion(session, profileId, body as { itemId?: unknown; completed?: unknown }));
  } catch (error) {
    return onboardingError(error);
  }
}
