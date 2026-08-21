import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerRootComponent } from "expo";

import { view } from "./storybook.requires";

const StorybookRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

registerRootComponent(StorybookRoot);
