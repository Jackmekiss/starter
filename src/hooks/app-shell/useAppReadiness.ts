import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../core/init-redux-store";
import useSessionStore from "../../stores/session-store";

export function useAppReadiness(isRetrievingAccount: boolean) {
  const [isReady, setIsReady] = useState(false);
  const account = useSelector((state: RootState) => state.auth.account);
  const authStatus = useSelector((state: RootState) => state.auth.status);
  const { setIsConnected } = useSessionStore();

  useEffect(() => {
    if (account) {
      setIsConnected(true);
    } else if (!isRetrievingAccount && authStatus !== "loading") {
      setIsConnected(false);
    }

    const timeoutId = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [account, authStatus, isRetrievingAccount, setIsConnected]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hide();
    }
  }, [isReady]);
}
