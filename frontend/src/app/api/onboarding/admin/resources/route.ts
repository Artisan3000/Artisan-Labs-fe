import { listAdminResources } from "@/lib/onboarding/resources";
import { onboardingError, onboardingJson, requireOnboardingSession } from "@/lib/onboarding/security";

export async function GET() { try { const session = await requireOnboardingSession(); return onboardingJson(await listAdminResources(session)); } catch (error) { return onboardingError(error); } }
export const dynamic = "force-dynamic";
