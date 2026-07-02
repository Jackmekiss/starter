/**
 * Lifecycle stage that controls whether an account can enter the main app.
 */
export type OnboardingStatus = "pending" | "in-progress" | "completed";

/**
 * User-owned profile data attached to an authenticated identity.
 */
export interface Account {
  /**
   * Stable account identifier shared with auth-owned records.
   */
  id: string;

  /**
   * Primary contact and login email for the account.
   */
  email: string;

  /**
   * Optional profile avatar URI, with null representing an explicit removal.
   */
  avatarUri?: string | null;

  /**
   * Optional given name displayed in profile and account surfaces.
   */
  firstName?: string;

  /**
   * Optional family name displayed in profile and account surfaces.
   */
  lastName?: string;

  /**
   * Current onboarding lifecycle stage for routing decisions.
   */
  onboardingStatus?: OnboardingStatus;

  /**
   * ISO timestamp recording when the account profile was created.
   */
  createdAt: string;
}
