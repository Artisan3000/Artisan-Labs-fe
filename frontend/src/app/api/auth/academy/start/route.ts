import { getAcademySsoConfig } from "@/lib/academy-sso/config";
import {
  createPkceChallenge,
  createPkceVerifier,
  randomToken,
} from "@/lib/academy-sso/crypto";
import { authError, authRedirect } from "@/lib/academy-sso/response";
import {
  getEmployeeSession,
  setSsoTransaction,
} from "@/lib/academy-sso/session";

export async function GET(request: Request) {
  const config = getAcademySsoConfig();
  if (!config.enabled) return authError("Not found.", 404);

  if (await getEmployeeSession()) {
    return authRedirect(new URL("/careers/portal", request.url));
  }

  const state = randomToken();
  const verifier = createPkceVerifier();
  const challenge = createPkceChallenge(verifier);
  await setSsoTransaction(
    {
      state,
      verifier,
      callbackUrl: config.callbackUrl,
      expiresAt: Date.now() + 5 * 60 * 1000,
    },
    config.sessionSecret
  );

  const authorizeUrl = new URL("/api/sso/authorize", config.academyUrl);
  authorizeUrl.searchParams.set("client_id", config.clientId);
  authorizeUrl.searchParams.set("redirect_uri", config.callbackUrl);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("code_challenge", challenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");
  return authRedirect(authorizeUrl);
}

export const dynamic = "force-dynamic";
