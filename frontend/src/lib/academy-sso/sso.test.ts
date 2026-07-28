import assert from "node:assert/strict";
import test from "node:test";
import { getAcademySsoConfig } from "./config";
import {
  createPkceChallenge,
  createPkceVerifier,
  openJson,
  sealJson,
} from "./crypto";
import { parseExchangedIdentity } from "./session";

test("generates an S256 PKCE pair", () => {
  const verifier = createPkceVerifier();
  const challenge = createPkceChallenge(verifier);
  assert.match(verifier, /^[A-Za-z0-9_-]{64}$/);
  assert.match(challenge, /^[A-Za-z0-9_-]{43}$/);
});

test("encrypts, authenticates, and domain-separates cookie payloads", () => {
  const secret = "s".repeat(32);
  const value = { state: "state", expiresAt: 123 };
  const token = sealJson(value, secret, "transaction");
  const tampered =
    token.slice(0, 40) + (token[40] === "a" ? "b" : "a") + token.slice(41);

  assert.deepEqual(openJson(token, secret, "transaction"), value);
  assert.equal(openJson(token, secret, "session"), null);
  assert.equal(openJson(tampered, secret, "transaction"), null);
});

test("accepts only Employee and Admin exchange identities", () => {
  assert.deepEqual(
    parseExchangedIdentity({
      user: {
        userId: "user-1",
        name: "Employee",
        email: "employee@example.com",
        role: "EMPLOYEE",
      },
    }),
    {
      userId: "user-1",
      name: "Employee",
      email: "employee@example.com",
      role: "EMPLOYEE",
    }
  );
  assert.equal(
    parseExchangedIdentity({
      user: {
        userId: "user-2",
        name: "Student",
        email: "student@example.com",
        role: "STUDENT",
      },
    }),
    null
  );
});

test("defaults disabled and requires an explicit Preview callback", () => {
  const original = { ...process.env };

  try {
    process.env.ACADEMY_SSO_ENABLED = "false";
    assert.deepEqual(getAcademySsoConfig(), { enabled: false });

    process.env.ACADEMY_SSO_ENABLED = "true";
    process.env.VERCEL_ENV = "preview";
    process.env.ACADEMY_SSO_CLIENT_SECRET = "c".repeat(32);
    process.env.ARTISAN_SESSION_SECRET = "s".repeat(32);
    delete process.env.ACADEMY_SSO_CALLBACK_URL;
    assert.throws(
      () => getAcademySsoConfig(),
      /ACADEMY_SSO_CALLBACK_URL is required/
    );

    process.env.ACADEMY_SSO_CALLBACK_URL =
      "https://artisan-preview.example.com/api/auth/callback/academy";
    const config = getAcademySsoConfig();
    assert.equal(
      config.enabled && config.callbackUrl,
      process.env.ACADEMY_SSO_CALLBACK_URL
    );
  } finally {
    for (const key of Object.keys(process.env)) {
      if (!(key in original)) delete process.env[key];
    }
    Object.assign(process.env, original);
  }
});
