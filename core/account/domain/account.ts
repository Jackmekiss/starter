/** Backend-owned lifecycle used by every device to select onboarding or the main app. */
export type AccountOnboardingStatus = "pending" | "completed";

/** Backend-owned profile attached to an authenticated identity. */
export interface Account {
  /** Stable verified identity subject. */
  id: string;
  /** Latest verified identity email. */
  email: string;
  /** Editable public name, or null when unset. */
  displayName: string | null;
  /** Durable onboarding lifecycle returned by the backend. */
  onboardingStatus: AccountOnboardingStatus;
  /** ISO timestamp recorded at provisioning. */
  createdAt: string;
  /** ISO timestamp of the latest synchronization or update. */
  updatedAt: string;
}
