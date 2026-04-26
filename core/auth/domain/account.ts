import { Subscription } from "./subscription";

export type OnboardingStatus = "pending" | "in-progress" | "completed";

export interface Account {
  id: string;
  email: string;

  avatarUri?: string | null;
  firstName?: string;
  lastName?: string;
  subscription?: Subscription | null;
  onboardingStatus?: OnboardingStatus;

  createdAt: string;
}
