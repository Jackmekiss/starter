import * as AppleAuthentication from "expo-apple-authentication";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { SupabaseAuthRuntime } from "../../core/auth/adapters/supabase/supabaseAuthRuntime";

const createNonce = () => {
  const randomUuid = globalThis.crypto?.randomUUID?.();

  if (randomUuid) {
    return randomUuid;
  }

  return [
    Date.now().toString(36),
    Math.random().toString(36).slice(2),
    Math.random().toString(36).slice(2)
  ].join("-");
};

export const createExpoSupabaseAuthRuntime = (): SupabaseAuthRuntime => ({
  async retrieveAuthCapabilities() {
    const isAppleSupported =
      Platform.OS === "ios"
        ? await AppleAuthentication.isAvailableAsync().catch(() => false)
        : false;

    return {
      isGoogleAuthAvailable:
        process.env.EXPO_PUBLIC_ENABLE_GOOGLE_AUTH === "true",
      isAppleAuthAvailable:
        isAppleSupported &&
        process.env.EXPO_PUBLIC_ENABLE_APPLE_AUTH === "true",
      isPasswordResetAvailable: true
    };
  },
  createRedirectUrl(pathname) {
    return Linking.createURL(pathname);
  },
  async openOAuthSession(authUrl, redirectUrl) {
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

    if (result.type === "success") {
      return {
        type: "success",
        callbackUrl: result.url
      };
    }

    return {
      type: "cancel"
    };
  },
  async signInWithApple() {
    try {
      const nonce = createNonce();
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ],
        nonce
      });

      if (!credential.identityToken) {
        throw new Error("Apple sign-in did not return an identity token.");
      }

      return {
        type: "success",
        credential: {
          idToken: credential.identityToken,
          nonce,
          email: credential.email,
          firstName: credential.fullName?.givenName,
          lastName: credential.fullName?.familyName
        }
      };
    } catch (error: any) {
      if (error?.code === "ERR_REQUEST_CANCELED") {
        return {
          type: "cancel"
        };
      }

      if (error?.code === "ERR_REQUEST_FAILED") {
        throw new Error(
          "Apple native sign-in failed (ERR_REQUEST_FAILED). Check that Sign in with Apple is enabled for the iOS App ID, that the device is signed into Apple ID, and test on a real device if possible.",
          { cause: error }
        );
      }

      if (
        typeof error?.message === "string" &&
        typeof error?.code === "string"
      ) {
        throw new Error(
          `Apple native sign-in failed (${error.code}): ${error.message}`,
          { cause: error }
        );
      }

      throw error instanceof Error
        ? error
        : new Error("Apple native sign-in failed for an unknown reason.");
    }
  }
});
