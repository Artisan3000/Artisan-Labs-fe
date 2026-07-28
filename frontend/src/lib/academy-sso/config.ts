import "server-only";

const DEFAULT_ACADEMY_URL = "https://academy.artisanbarber.com";
const DEFAULT_CLIENT_ID = "artisan-employee-portal";
const DEFAULT_PRODUCTION_CALLBACK =
  "https://www.artisanbarber.com/api/auth/callback/academy";
const DEFAULT_LOCAL_CALLBACK =
  "http://localhost:3000/api/auth/callback/academy";

export type AcademySsoConfig =
  | { enabled: false }
  | {
      enabled: true;
      academyUrl: string;
      clientId: string;
      clientSecret: string;
      callbackUrl: string;
      sessionSecret: string;
      sessionMaxAgeSeconds: number;
    };

export function isAcademySsoEnabled() {
  return process.env.ACADEMY_SSO_ENABLED === "true";
}

function required(name: string, fallback?: string) {
  const value = (process.env[name] ?? fallback ?? "").trim();
  if (!value) throw new Error(`${name} is required when Academy SSO is enabled.`);
  return value;
}

function secret(name: string) {
  const value = process.env[name] ?? "";
  if (Buffer.byteLength(value, "utf8") < 32) {
    throw new Error(`${name} must contain at least 32 bytes.`);
  }
  return value;
}

function exactUrl(value: string, { callback = false } = {}) {
  const parsed = new URL(value);
  const local =
    parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  const serializedMatches = callback
    ? parsed.toString() === value
    : value === parsed.origin || value === `${parsed.origin}/`;

  if (
    parsed.username ||
    parsed.password ||
    parsed.hash ||
    parsed.search ||
    (parsed.protocol !== "https:" && !(local && parsed.protocol === "http:")) ||
    (!callback && parsed.pathname !== "/") ||
    !serializedMatches
  ) {
    throw new Error(`Invalid SSO URL: ${value}`);
  }

  return callback ? value : parsed.origin;
}

export function getAcademySsoConfig(): AcademySsoConfig {
  if (!isAcademySsoEnabled()) return { enabled: false };

  const deploymentEnvironment =
    process.env.VERCEL_ENV ??
    (process.env.NODE_ENV === "production" ? "production" : "development");
  const callbackFallback =
    deploymentEnvironment === "production"
      ? DEFAULT_PRODUCTION_CALLBACK
      : deploymentEnvironment === "development"
        ? DEFAULT_LOCAL_CALLBACK
        : undefined;
  const maxAge = Number.parseInt(
    process.env.ARTISAN_SESSION_MAX_AGE_SECONDS ?? "3600",
    10
  );

  return {
    enabled: true,
    academyUrl: exactUrl(
      required("ACADEMY_SSO_BASE_URL", DEFAULT_ACADEMY_URL)
    ),
    clientId: required("ACADEMY_SSO_CLIENT_ID", DEFAULT_CLIENT_ID),
    clientSecret: secret("ACADEMY_SSO_CLIENT_SECRET"),
    callbackUrl: exactUrl(
      required("ACADEMY_SSO_CALLBACK_URL", callbackFallback),
      { callback: true }
    ),
    sessionSecret: secret("ARTISAN_SESSION_SECRET"),
    sessionMaxAgeSeconds: Number.isFinite(maxAge)
      ? Math.min(14400, Math.max(900, maxAge))
      : 3600,
  };
}

export function getConfiguredSessionSecret() {
  const value = process.env.ARTISAN_SESSION_SECRET ?? "";
  return Buffer.byteLength(value, "utf8") >= 32 ? value : null;
}
