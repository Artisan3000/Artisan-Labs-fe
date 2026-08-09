import { listAdminProfileResources } from "@/lib/onboarding/resources";
import { onboardingError, onboardingJson, requireOnboardingSession } from "@/lib/onboarding/security";

export async function GET(_request: Request, context: { params: Promise<{ profileId: string }> }) { try { const session = await requireOnboardingSession(); const { profileId } = await context.params; return onboardingJson({ resources: await listAdminProfileResources(session, profileId) }); } catch (error) { return onboardingError(error); } }
export const dynamic = "force-dynamic";
