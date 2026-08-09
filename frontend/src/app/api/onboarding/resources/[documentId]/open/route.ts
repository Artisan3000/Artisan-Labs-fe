import { openResource } from "@/lib/onboarding/mutations";
import { privateDownloadUrl } from "@/lib/onboarding/blob";
import { OnboardingHttpError, PRIVATE_HEADERS, onboardingError, requireOnboardingSession } from "@/lib/onboarding/security";

export async function GET(
  _request: Request,
  context: { params: Promise<{ documentId: string }> }
) {
  try {
    const session = await requireOnboardingSession();
    const { documentId } = await context.params;
    const document = await openResource(session, documentId);
    if (document.type === "EXTERNAL_LINK") {
      if (!document.externalUrl) throw new OnboardingHttpError(404, "Resource not found.");
      const target = new URL(document.externalUrl);
      if (target.protocol !== "https:") throw new OnboardingHttpError(404, "Resource not found.");
      return new Response(null, { status: 303, headers: { ...PRIVATE_HEADERS, Location: target.toString() } });
    }
    if (!document.blobPathname) throw new OnboardingHttpError(404, "Resource not found.");
    return new Response(null, { status: 303, headers: { ...PRIVATE_HEADERS, Location: await privateDownloadUrl(document.blobPathname) } });
  } catch (error) {
    return onboardingError(error);
  }
}

export const dynamic = "force-dynamic";
