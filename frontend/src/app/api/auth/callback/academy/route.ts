import { getAcademySsoConfig } from "@/lib/academy-sso/config";
import { safeEqual } from "@/lib/academy-sso/crypto";
import { authError, authRedirect } from "@/lib/academy-sso/response";
import {
  consumeSsoTransaction,
  createEmployeeSession,
  parseExchangedIdentity,
} from "@/lib/academy-sso/session";
import { syncIdentityIfOnboardingEnabled } from "@/lib/onboarding/data";

function exactParam(params: URLSearchParams, name: string) {
  const values = params.getAll(name);
  return values.length === 1 ? values[0] : null;
}

export async function GET(request: Request) {
  const config = getAcademySsoConfig();
  if (!config.enabled) return authError("Not found.", 404);

  const url = new URL(request.url);
  if (`${url.origin}${url.pathname}` !== config.callbackUrl) {
    return authError("Unable to complete employee login.", 400);
  }
  const code = exactParam(url.searchParams, "code");
  const state = exactParam(url.searchParams, "state");
  const transaction = await consumeSsoTransaction(config.sessionSecret);

  if (
    !transaction ||
    !code ||
    !/^[A-Za-z0-9_-]{43}$/.test(code) ||
    !state ||
    !safeEqual(state, transaction.state) ||
    transaction.callbackUrl !== config.callbackUrl
  ) {
    return authError("Unable to complete employee login.", 400);
  }

  let exchangeResponse: Response;
  try {
    exchangeResponse = await fetch(
      new URL("/api/sso/exchange", config.academyUrl),
      {
        method: "POST",
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${config.clientId}:${config.clientSecret}`,
            "utf8"
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          redirect_uri: config.callbackUrl,
          code_verifier: transaction.verifier,
        }),
      }
    );
  } catch {
    return authError("Employee login is temporarily unavailable.", 503);
  }

  if (!exchangeResponse.ok) {
    return authError("Unable to complete employee login.", 400);
  }

  const identity = parseExchangedIdentity(
    await exchangeResponse.json().catch(() => null)
  );
  if (!identity) {
    return authError("Unable to complete employee login.", 400);
  }

  try {
    await syncIdentityIfOnboardingEnabled(identity);
  } catch {
    return authError("Employee onboarding is temporarily unavailable.", 503);
  }

  await createEmployeeSession(
    identity,
    config.sessionSecret,
    config.sessionMaxAgeSeconds
  );
  return authRedirect(new URL("/careers/portal", config.callbackUrl));
}

export const dynamic = "force-dynamic";
