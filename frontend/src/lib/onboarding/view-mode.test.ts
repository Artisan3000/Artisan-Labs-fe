import assert from "node:assert/strict";
import test from "node:test";
import { classificationForViewMode, isAdminViewMode, parseAdminViewMode } from "./view-mode";

test("only the supported admin view modes are accepted", () => {
  assert.equal(isAdminViewMode("ADMIN"), true);
  assert.equal(isAdminViewMode("W2"), true);
  assert.equal(isAdminViewMode("CONTRACTOR_1099"), true);
  assert.equal(isAdminViewMode("EMPLOYEE"), false);
  assert.equal(isAdminViewMode("W2; role=ADMIN"), false);
  assert.equal(parseAdminViewMode("unexpected"), "ADMIN");
});

test("employee classifications are view-only projections", () => {
  assert.equal(classificationForViewMode("ADMIN"), null);
  assert.equal(classificationForViewMode("W2"), "W2");
  assert.equal(classificationForViewMode("CONTRACTOR_1099"), "CONTRACTOR_1099");
});
