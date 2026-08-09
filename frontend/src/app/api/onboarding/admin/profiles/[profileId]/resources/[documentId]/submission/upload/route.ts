import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { authorizeAdminSubmission, completeSubmissionUpload } from "@/lib/onboarding/uploads";
import { onboardingError, onboardingJson, requireOnboardingSession, requireTrustedOrigin } from "@/lib/onboarding/security";

export async function POST(request: Request, context: { params: Promise<{ profileId: string; documentId: string }> }) {
  try { const body = await request.json() as HandleUploadBody; const { profileId, documentId } = await context.params; if (body.type === "blob.generate-client-token") requireTrustedOrigin(request); const session = body.type === "blob.generate-client-token" ? await requireOnboardingSession() : null;
    return onboardingJson(await handleUpload({ request, body,
      onBeforeGenerateToken: async (pathname) => { if (!session) throw new Error("Missing session."); return authorizeAdminSubmission(session, profileId, pathname, JSON.stringify({ documentId })); },
      onUploadCompleted: async ({ blob, tokenPayload }) => completeSubmissionUpload(blob, tokenPayload ?? null),
    }));
  } catch (error) { return onboardingError(error); }
}
export const dynamic = "force-dynamic";
