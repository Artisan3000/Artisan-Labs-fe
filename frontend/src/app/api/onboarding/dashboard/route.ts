import { getOnboardingView } from "@/lib/onboarding/data";
import { onboardingError, onboardingJson, requireOnboardingSession } from "@/lib/onboarding/security";

export async function GET(request: Request) {
  try {
    const session = await requireOnboardingSession();
    const previewProfileId = new URL(request.url).searchParams.get("previewProfileId") ?? undefined;
    return onboardingJson(await getOnboardingView({ session, previewProfileId }));
  } catch (error) {
    return onboardingError(error);
  }
}

export const dynamic = "force-dynamic";
