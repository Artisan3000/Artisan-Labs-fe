export type PortalRole = "EMPLOYEE" | "ADMIN";
export type EmploymentType = "W2" | "CONTRACTOR_1099" | null;

export interface PortalIdentity {
  profileId: string;
  name: string;
  email: string;
  role: PortalRole;
  employmentType: EmploymentType;
  startDate: string | null;
  trainingAccess: boolean;
  assistantStylistEligible: boolean;
  active: boolean;
}

export interface PortalProgress {
  completed: number;
  total: number;
  percent: number;
  checklistCompleted: number;
  checklistTotal: number;
  meetingsCompleted: number;
  meetingsTotal: number;
  resourcesCompleted: number;
  resourcesTotal: number;
}

export interface ChecklistItemView {
  id: string;
  label: string;
  completed: boolean;
  readOnly: boolean;
  source: "MANUAL" | "MEETING";
}

export interface ChecklistGroupView {
  id: string;
  title: string;
  subtitle: string | null;
  items: ChecklistItemView[];
}

export interface MeetingView {
  id: string;
  ordinal: string;
  title: string;
  description: string;
  durationMinutes: number;
  status: "NOT_SCHEDULED" | "SCHEDULED" | "COMPLETED";
  scheduledAt: string | null;
  hostName: string | null;
}

export interface ResourceDocumentView {
  id: string;
  title: string;
  description: string | null;
  kind: "FILE" | "LINK";
  href: string;
  required: boolean;
  opened: boolean;
  completed: boolean;
  version: string;
  resourceType: "REFERENCE" | "SUBMISSION_FORM";
  submittedAt: string | null;
  resubmissionRequired: boolean;
}

export interface ResourceCategoryView {
  id: string;
  slug: string;
  title: string;
  eyebrow: string | null;
  introduction: string | null;
  sections: Array<{ id: string; heading: string; body: string }>;
  documents: ResourceDocumentView[];
}

export interface OnboardingView {
  viewerRole: PortalRole;
  profile: PortalIdentity;
  isPreview: boolean;
  progress: PortalProgress;
  nextMeeting: MeetingView | null;
  checklistGroups: ChecklistGroupView[];
  meetings: MeetingView[];
  resourceCategories: ResourceCategoryView[];
}

export interface AdminProfileSummary {
  profileId: string;
  name: string;
  email: string;
  employmentType: EmploymentType;
  active: boolean;
  startDate: string | null;
  progressPercent: number | null;
  trainingAccess: boolean;
  assistantStylistEligible: boolean;
}
