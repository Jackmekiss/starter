import AsyncStorage from "@react-native-async-storage/async-storage";

import { view } from "./storybook.requires";

/** Storybook UI reusable by the swapped entry and the in-app development route. */
const StorybookRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

export default StorybookRoot;
