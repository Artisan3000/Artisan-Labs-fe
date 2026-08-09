import assert from "node:assert/strict";
import test from "node:test";
import {
  OnboardingHttpError,
  requireAdmin,
  requireJsonMutation,
  requireObjectWithOnlyKeys,
} from "./security";

test("admin guard relies on the current signed-session role", () => {
  assert.doesNotThrow(() => requireAdmin({ userId: "1", name: "A", email: "a@example.com", role: "ADMIN" }));
  assert.throws(
    () => requireAdmin({ userId: "2", name: "E", email: "e@example.com", role: "EMPLOYEE" }),
    (error) => error instanceof OnboardingHttpError && error.status === 403
  );
});

test("mutation schemas reject non-objects and unexpected fields", () => {
  assert.doesNotThrow(() =>
    requireObjectWithOnlyKeys({ completed: true }, ["completed"])
  );
  for (const value of [null, [], "invalid"]) {
    assert.throws(
      () => requireObjectWithOnlyKeys(value, ["completed"]),
      (error) => error instanceof OnboardingHttpError && error.status === 400
    );
  }
  assert.throws(
    () => requireObjectWithOnlyKeys({ completed: true, profileId: "other" }, ["completed"]),
    (error) => error instanceof OnboardingHttpError && error.status === 400
  );
});

test("JSON mutations require exact origin and JSON", async () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;
  const previousVercelUrl = process.env.VERCEL_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "https://www.artisanbarber.com";
  process.env.VERCEL_URL = "artisan-preview.example.vercel.app";
  try {
    const body = await requireJsonMutation(new Request("https://www.artisanbarber.com/api/onboarding/checklist", {
      method: "POST",
      headers: { origin: "https://www.artisanbarber.com", "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ completed: true }),
    }));
    assert.deepEqual(body, { completed: true });
    const previewBody = await requireJsonMutation(new Request("https://artisan-preview.example.vercel.app/api/onboarding/checklist", {
      method: "POST",
      headers: { origin: "https://artisan-preview.example.vercel.app", "content-type": "application/json" },
      body: JSON.stringify({ completed: false }),
    }));
    assert.deepEqual(previewBody, { completed: false });
    await assert.rejects(requireJsonMutation(new Request("https://www.artisanbarber.com/api/onboarding/checklist", {
      method: "POST",
      headers: { origin: "https://evil.example", "content-type": "application/json" },
      body: "{}",
    })), (error) => error instanceof OnboardingHttpError && error.status === 403);
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previous;
    if (previousVercelUrl === undefined) delete process.env.VERCEL_URL;
    else process.env.VERCEL_URL = previousVercelUrl;
  }
});
