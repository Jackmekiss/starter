export type LoopPlaybackOrigin = "affirmations" | "home";

const getSingleParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export const parseLoopPlaybackOrigin = (
  value?: string | string[]
): LoopPlaybackOrigin =>
  getSingleParam(value) === "affirmations" ? "affirmations" : "home";

export const getLoopPlaybackOriginRoute = (origin: LoopPlaybackOrigin) =>
  origin === "affirmations" ? "/(tabs)/(affirmations)" : "/(tabs)/(home)";
