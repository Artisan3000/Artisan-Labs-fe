import { clearEmployeeSession } from "@/lib/academy-sso/session";
import { authError, authRedirect } from "@/lib/academy-sso/response";
import { cookies } from "next/headers";
import { ADMIN_VIEW_MODE_COOKIE } from "@/lib/onboarding/view-mode";

function trustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const allowed = new Set<string>([
    (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.artisanbarber.com").replace(
      /\/$/,
      ""
    ),
  ]);
  if (process.env.VERCEL_URL) allowed.add(`https://${process.env.VERCEL_URL}`);
  if (process.env.NODE_ENV !== "production") {
    allowed.add("http://localhost:3000");
    allowed.add("http://127.0.0.1:3000");
  }

  try {
    const parsed = new URL(origin);
    return origin === parsed.origin && allowed.has(parsed.origin);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!trustedOrigin(request)) {
    return authError("Request origin is not allowed.", 403);
  }
  await clearEmployeeSession();
  (await cookies()).set(ADMIN_VIEW_MODE_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: new Date(0), maxAge: 0 });
  return authRedirect(new URL("/careers", request.url));
}

export const dynamic = "force-dynamic";
