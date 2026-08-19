import { SecureSessionStorage } from "@core/auth/adapters/secure-store/secure-session-storage";

/** Shared secure session-storage adapter used by auth and app bootstrap. */
export const sessionStorage = new SecureSessionStorage();
