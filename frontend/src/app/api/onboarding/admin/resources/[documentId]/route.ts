import { deleteAdminResource, updateAdminResource } from "@/lib/onboarding/resources";
import { onboardingError, onboardingJson, requireJsonMutation, requireOnboardingSession } from "@/lib/onboarding/security";

export async function PATCH(request: Request, context: { params: Promise<{ documentId: string }> }) { try { const session = await requireOnboardingSession(); const { documentId } = await context.params; return onboardingJson(await updateAdminResource(session, documentId, await requireJsonMutation(request))); } catch (error) { return onboardingError(error); } }
export async function DELETE(request: Request, context: { params: Promise<{ documentId: string }> }) { try { const session = await requireOnboardingSession(); await requireJsonMutation(request); const { documentId } = await context.params; return onboardingJson(await deleteAdminResource(session, documentId)); } catch (error) { return onboardingError(error); } }
