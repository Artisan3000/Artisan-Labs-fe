export type Classification = "W2" | "CONTRACTOR_1099";
export type AppliesTo = "ALL" | Classification;

export function appliesTo(
  applicability: AppliesTo,
  classification: Classification | null
) {
  return applicability === "ALL" || applicability === classification;
}

export function calculateProgress(input: {
  checklist: Array<{ completed: boolean }>;
  meetings: Array<{ completed: boolean }>;
  requiredResources: Array<{ completed: boolean }>;
}) {
  const units = [
    ...input.checklist,
    ...input.meetings,
    ...input.requiredResources,
  ];
  const completed = units.filter((unit) => unit.completed).length;
  const total = units.length;
  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function meetingStatus(input: {
  completedAt: Date | null;
  scheduledAt: Date | null;
}) {
  if (input.completedAt) return "COMPLETED" as const;
  if (input.scheduledAt) return "SCHEDULED" as const;
  return "NOT_SCHEDULED" as const;
}

export function resourceIsComplete(input: {
  version: number;
  completedAt: Date | null;
  completedVersion: number | null;
}) {
  return Boolean(
    input.completedAt && input.completedVersion === input.version
  );
}

export function formSubmissionIsComplete(input: {
  submittedVersion: number | null;
  requiredSubmissionVersion: number;
}) {
  return input.submittedVersion !== null && input.submittedVersion >= input.requiredSubmissionVersion;
}
