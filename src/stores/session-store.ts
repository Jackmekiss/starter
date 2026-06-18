import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** Persisted UI session state used before auth account retrieval completes. */
export interface SessionStore {
  isConnected: boolean;
  toggleIsConnected: () => void;
  setIsConnected: (isConnected: boolean) => void;
}

const asyncStoragePersistConfig = {
  setItem: async (key: string, value: string) =>
    AsyncStorage.setItem(key, value),
  getItem: async (key: string) => AsyncStorage.getItem(key),
  removeItem: async (key: string) => AsyncStorage.removeItem(key),
};

const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      isConnected: false,
      toggleIsConnected: () =>
        set((state) => ({
          isConnected: !state.isConnected,
        })),
      setIsConnected: (isConnected: boolean) => set({ isConnected }),
    }),
    {
      name: "session",
      storage: createJSONStorage(() => asyncStoragePersistConfig),
    },
  ),
);

export default useSessionStore;
