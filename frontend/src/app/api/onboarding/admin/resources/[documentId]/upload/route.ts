import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { authorizeAdminUpload, completeAdminUpload } from "@/lib/onboarding/uploads";
import { onboardingError, onboardingJson, requireOnboardingSession, requireTrustedOrigin } from "@/lib/onboarding/security";

export async function POST(request: Request, context: { params: Promise<{ documentId: string }> }) {
  try { const body = await request.json() as HandleUploadBody; const { documentId } = await context.params; if (body.type === "blob.generate-client-token") requireTrustedOrigin(request); const session = body.type === "blob.generate-client-token" ? await requireOnboardingSession() : null;
    return onboardingJson(await handleUpload({ request, body,
      onBeforeGenerateToken: async (pathname, payload) => { if (!session) throw new Error("Missing session."); const parsed = JSON.parse(payload ?? "{}") as Record<string, unknown>; return authorizeAdminUpload(session, pathname, JSON.stringify({ ...parsed, action: "REPLACE", documentId })); },
      onUploadCompleted: async ({ blob, tokenPayload }) => completeAdminUpload(blob, tokenPayload ?? null),
    }));
  } catch (error) { return onboardingError(error); }
}
export const dynamic = "force-dynamic";
