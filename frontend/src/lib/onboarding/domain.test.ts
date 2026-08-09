import assert from "node:assert/strict";
import test from "node:test";
import { appliesTo, calculateProgress, formSubmissionIsComplete, meetingStatus, resourceIsComplete } from "./domain";

test("classification applicability does not leak 1099 content to W-2", () => {
  assert.equal(appliesTo("ALL", "W2"), true);
  assert.equal(appliesTo("W2", "W2"), true);
  assert.equal(appliesTo("CONTRACTOR_1099", "W2"), false);
  assert.equal(appliesTo("CONTRACTOR_1099", null), false);
});

test("form completion survives ordinary template replacement but obeys explicit resubmission version", () => {
  assert.equal(formSubmissionIsComplete({ submittedVersion: 1, requiredSubmissionVersion: 1 }), true);
  assert.equal(formSubmissionIsComplete({ submittedVersion: 1, requiredSubmissionVersion: 2 }), false);
  assert.equal(formSubmissionIsComplete({ submittedVersion: 2, requiredSubmissionVersion: 2 }), true);
  assert.equal(formSubmissionIsComplete({ submittedVersion: null, requiredSubmissionVersion: 1 }), false);
});

test("derived progress counts supplied units exactly once", () => {
  assert.deepEqual(calculateProgress({
    checklist: [{ completed: true }, { completed: false }],
    meetings: [{ completed: true }],
    requiredResources: [{ completed: false }],
  }), { completed: 2, total: 4, percent: 50 });
  assert.deepEqual(calculateProgress({ checklist: [], meetings: [], requiredResources: [] }), { completed: 0, total: 0, percent: 0 });
});

test("meeting status is derived with completion taking precedence", () => {
  const now = new Date();
  assert.equal(meetingStatus({ completedAt: now, scheduledAt: now }), "COMPLETED");
  assert.equal(meetingStatus({ completedAt: null, scheduledAt: now }), "SCHEDULED");
  assert.equal(meetingStatus({ completedAt: null, scheduledAt: null }), "NOT_SCHEDULED");
});

test("resource completion applies only to the current version", () => {
  const now = new Date();
  assert.equal(resourceIsComplete({ version: 2, completedAt: now, completedVersion: 2 }), true);
  assert.equal(resourceIsComplete({ version: 2, completedAt: now, completedVersion: 1 }), false);
  assert.equal(resourceIsComplete({ version: 2, completedAt: null, completedVersion: 2 }), false);
});
