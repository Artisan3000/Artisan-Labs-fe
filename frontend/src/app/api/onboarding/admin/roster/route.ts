import { listAdminProfiles } from "@/lib/onboarding/data";
import { onboardingError, onboardingJson, requireOnboardingSession } from "@/lib/onboarding/security";

export async function GET() {
  try {
    const session = await requireOnboardingSession();
    return onboardingJson({ profiles: await listAdminProfiles(session) });
  } catch (error) {
    return onboardingError(error);
  }
}

export const dynamic = "force-dynamic";
