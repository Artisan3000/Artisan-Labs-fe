import { setResourceCompletion } from "@/lib/onboarding/mutations";
import { onboardingError, onboardingJson, requireJsonMutation, requireOnboardingSession } from "@/lib/onboarding/security";

export async function POST(request: Request) {
  try {
    const session = await requireOnboardingSession();
    const body = await requireJsonMutation(request);
    return onboardingJson(await setResourceCompletion(session, body as { documentId: unknown; completed: unknown }));
  } catch (error) {
    return onboardingError(error);
  }
}
