import { cookies } from "next/headers";
import { getEmployeeSession } from "@/lib/academy-sso/session";
import { onboardingError, onboardingJson, requireJsonMutation } from "@/lib/onboarding/security";
import { ADMIN_VIEW_MODE_COOKIE, isAdminViewMode } from "@/lib/onboarding/view-mode";

export async function POST(request: Request) {
  try {
    const session = await getEmployeeSession();
    if (!session || session.role !== "ADMIN") return onboardingJson({ error: "Administrator access required." }, 403);
    const body = await requireJsonMutation(request);
    if (!isAdminViewMode(body.mode)) return onboardingJson({ error: "Invalid view mode." }, 400);
    (await cookies()).set(ADMIN_VIEW_MODE_COOKIE, body.mode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
    return onboardingJson({ mode: body.mode });
  } catch (error) {
    return onboardingError(error);
  }
}

export const dynamic = "force-dynamic";
