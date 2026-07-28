import "server-only";

import { cookies } from "next/headers";
import {
  getConfiguredSessionSecret,
  isAcademySsoEnabled,
} from "./config";
import { openJson, sealJson } from "./crypto";

export const EMPLOYEE_SESSION_COOKIE = "artisan_employee_session";
export const SSO_TRANSACTION_COOKIE = "artisan_sso_transaction";
const SESSION_PURPOSE = "artisan-employee-session-v1";
const TRANSACTION_PURPOSE = "academy-sso-transaction-v1";

export type EmployeeIdentity = {
  userId: string;
  name: string;
  email: string;
  role: "EMPLOYEE" | "ADMIN";
};

type EmployeeSession = EmployeeIdentity & {
  issuer: "academy.artisanbarber.com";
  issuedAt: number;
  expiresAt: number;
};

export type SsoTransaction = {
  state: string;
  verifier: string;
  callbackUrl: string;
  expiresAt: number;
};

function validIdentity(value: unknown): value is EmployeeIdentity {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<EmployeeIdentity>;
  return (
    typeof candidate.userId === "string" &&
    candidate.userId.length > 0 &&
    candidate.userId.length <= 128 &&
    typeof candidate.name === "string" &&
    candidate.name.length <= 200 &&
    typeof candidate.email === "string" &&
    candidate.email.length <= 320 &&
    (candidate.role === "EMPLOYEE" || candidate.role === "ADMIN")
  );
}

export function parseExchangedIdentity(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const user = (value as { user?: unknown }).user;
  return validIdentity(user) ? user : null;
}

export async function setSsoTransaction(
  transaction: SsoTransaction,
  secret: string
) {
  const cookieStore = await cookies();
  cookieStore.set(
    SSO_TRANSACTION_COOKIE,
    sealJson(transaction, secret, TRANSACTION_PURPOSE),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
      maxAge: 300,
    }
  );
}

export async function consumeSsoTransaction(secret: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SSO_TRANSACTION_COOKIE)?.value ?? "";
  cookieStore.set(SSO_TRANSACTION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    expires: new Date(0),
    maxAge: 0,
  });
  const transaction = openJson<SsoTransaction>(
    token,
    secret,
    TRANSACTION_PURPOSE
  );

  if (
    !transaction ||
    typeof transaction.state !== "string" ||
    typeof transaction.verifier !== "string" ||
    typeof transaction.callbackUrl !== "string" ||
    typeof transaction.expiresAt !== "number" ||
    transaction.expiresAt <= Date.now()
  ) {
    return null;
  }
  return transaction;
}

export async function createEmployeeSession(
  identity: EmployeeIdentity,
  secret: string,
  maxAgeSeconds: number
) {
  const now = Date.now();
  const session: EmployeeSession = {
    ...identity,
    issuer: "academy.artisanbarber.com",
    issuedAt: now,
    expiresAt: now + maxAgeSeconds * 1000,
  };
  const cookieStore = await cookies();
  cookieStore.set(
    EMPLOYEE_SESSION_COOKIE,
    sealJson(session, secret, SESSION_PURPOSE),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: maxAgeSeconds,
      expires: new Date(session.expiresAt),
    }
  );
}

export async function getEmployeeSession(): Promise<EmployeeSession | null> {
  if (!isAcademySsoEnabled()) return null;
  const secret = getConfiguredSessionSecret();
  if (!secret) return null;
  const cookieStore = await cookies();
  const token = cookieStore.get(EMPLOYEE_SESSION_COOKIE)?.value ?? "";
  const session = openJson<EmployeeSession>(token, secret, SESSION_PURPOSE);

  if (
    !session ||
    session.issuer !== "academy.artisanbarber.com" ||
    session.expiresAt <= Date.now() ||
    !validIdentity(session)
  ) {
    return null;
  }
  return session;
}

export async function clearEmployeeSession() {
  const cookieStore = await cookies();
  cookieStore.set(EMPLOYEE_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
}
