import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

import { useSelector } from "@/hooks/redux-hooks";
import useSessionStore from "@/stores/session-store";

/**
 * Synchronizes splash dismissal and persisted session state during app startup.
 */
export function useAppReadiness(isRetrievingAccount: boolean) {
  const [isReady, setIsReady] = useState(false);
  const account = useSelector((state) => state.auth.account);
  const { setIsConnected } = useSessionStore();

  useEffect(() => {
    if (account) {
      setIsConnected(true);
    } else if (!isRetrievingAccount) {
      setIsConnected(false);
    }

    const timeoutId = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [account, isRetrievingAccount, setIsConnected]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hide();
    }
  }, [isReady]);
}
