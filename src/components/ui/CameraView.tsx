import { CameraView as ExpoCameraView } from "expo-camera";
import { styled } from "nativewind";

import type { ElementRef } from "react";

/** Camera preview with NativeWind className support and no permission policy. */
const CameraView = styled(ExpoCameraView, {
  className: "style",
});

/** Imperative ref exposed by the Expo camera preview. */
type CameraViewRef = ElementRef<typeof ExpoCameraView>;

export { CameraView };
export type { CameraViewRef };
