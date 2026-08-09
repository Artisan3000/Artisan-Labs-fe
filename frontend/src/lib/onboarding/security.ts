import "server-only";

import type { EmployeeIdentity } from "@/lib/academy-sso/session";
import { getEmployeeSession } from "@/lib/academy-sso/session";
import { isOnboardingEnabled } from "./config";

export class OnboardingHttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export async function requireOnboardingSession(): Promise<EmployeeIdentity> {
  if (!isOnboardingEnabled()) throw new OnboardingHttpError(404, "Not found.");
  const session = await getEmployeeSession();
  if (!session) throw new OnboardingHttpError(401, "Authentication required.");
  return session;
}

export function requireAdmin(session: EmployeeIdentity) {
  if (session.role !== "ADMIN") {
    throw new OnboardingHttpError(403, "Administrator access required.");
  }
}

export function requireObjectWithOnlyKeys(
  input: unknown,
  allowed: readonly string[]
) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new OnboardingHttpError(400, "JSON object required.");
  }
  if (Object.keys(input).some((key) => !allowed.includes(key))) {
    throw new OnboardingHttpError(400, "Request contains unsupported fields.");
  }
}

function trustedOrigins() {
  const allowed = new Set<string>();
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      allowed.add(new URL(configured).origin);
    } catch {
      // A malformed configured origin fails closed.
    }
  }
  if (process.env.VERCEL_URL) {
    allowed.add(`https://${process.env.VERCEL_URL}`);
  }
  if (process.env.NODE_ENV !== "production") {
    allowed.add("http://localhost:3000");
    allowed.add("http://127.0.0.1:3000");
  }
  return allowed;
}

export function requireTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  let exactOrigin: string | null = null;
  try { exactOrigin = origin && new URL(origin).origin === origin ? origin : null; } catch { exactOrigin = null; }
  if (!exactOrigin || !trustedOrigins().has(exactOrigin)) {
    throw new OnboardingHttpError(403, "Untrusted request origin.");
  }
}

export async function requireJsonMutation(request: Request) {
  requireTrustedOrigin(request);
  const contentType = request.headers.get("content-type") ?? "";
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
    throw new OnboardingHttpError(415, "JSON request body required.");
  }
  const body = await request.json().catch(() => {
    throw new OnboardingHttpError(400, "Invalid JSON request body.");
  });
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new OnboardingHttpError(400, "JSON request body must be an object.");
  }
  return body as Record<string, unknown>;
}

export const PRIVATE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache",
  "Referrer-Policy": "no-referrer",
};

export function onboardingJson(body: unknown, status = 200) {
  return Response.json(body, { status, headers: PRIVATE_HEADERS });
}

export function onboardingError(error: unknown) {
  if (error instanceof OnboardingHttpError) {
    return onboardingJson({ error: error.message }, error.status);
  }
  console.error("Onboarding request failed", error);
  return onboardingJson({ error: "Onboarding is temporarily unavailable." }, 500);
}
