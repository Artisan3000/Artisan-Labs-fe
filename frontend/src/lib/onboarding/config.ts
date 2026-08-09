import "server-only";

export function isOnboardingEnabled() {
  return process.env.ARTISAN_ONBOARDING_ENABLED === "true";
}
