import { setChecklistCompletion } from "@/lib/onboarding/mutations";
import { onboardingError, onboardingJson, requireJsonMutation, requireOnboardingSession } from "@/lib/onboarding/security";

export async function POST(request: Request) {
  try {
    const session = await requireOnboardingSession();
    const body = await requireJsonMutation(request);
    return onboardingJson(await setChecklistCompletion(session, body as { itemId: unknown; completed: unknown }));
  } catch (error) {
    return onboardingError(error);
  }
}
