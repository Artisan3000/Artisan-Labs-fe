export const ADMIN_VIEW_MODE_COOKIE = "artisan_admin_view_mode";

export const ADMIN_VIEW_MODES = ["ADMIN", "W2", "CONTRACTOR_1099"] as const;
export type AdminViewMode = (typeof ADMIN_VIEW_MODES)[number];

export function isAdminViewMode(value: unknown): value is AdminViewMode {
  return typeof value === "string" && ADMIN_VIEW_MODES.includes(value as AdminViewMode);
}

export function parseAdminViewMode(value: unknown): AdminViewMode {
  return isAdminViewMode(value) ? value : "ADMIN";
}

export function classificationForViewMode(mode: AdminViewMode) {
  return mode === "W2" ? "W2" as const : mode === "CONTRACTOR_1099" ? "CONTRACTOR_1099" as const : null;
}
