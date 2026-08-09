import { getAdminSubmission } from "@/lib/onboarding/resources";
import { privateDownloadUrl } from "@/lib/onboarding/blob";
import { onboardingError, PRIVATE_HEADERS, requireOnboardingSession } from "@/lib/onboarding/security";

export async function GET(_request: Request, context: { params: Promise<{ profileId: string; documentId: string }> }) { try { const session = await requireOnboardingSession(); const { profileId, documentId } = await context.params; const { submission } = await getAdminSubmission(session, profileId, documentId); return new Response(null, { status: 303, headers: { ...PRIVATE_HEADERS, Location: await privateDownloadUrl(submission.blobPathname) } }); } catch (error) { return onboardingError(error); } }
export const dynamic = "force-dynamic";
