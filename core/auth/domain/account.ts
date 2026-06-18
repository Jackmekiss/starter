/**
 * Lifecycle stage that controls whether an account can enter the main app.
 */
export type OnboardingStatus = "pending" | "in-progress" | "completed";

/**
 * User-owned profile data attached to an authenticated identity.
 */
export interface Account {
  id: string;
  email: string;

  avatarUri?: string | null;
  firstName?: string;
  lastName?: string;
  onboardingStatus?: OnboardingStatus;

  createdAt: string;
}
