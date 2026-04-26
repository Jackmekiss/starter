export type NightFocusBlock =
  | "peace"
  | "release"
  | "trust"
  | "calm"
  | "self-love"
  | "let-go";

export interface NightFocusOption {
  id: NightFocusBlock;
  label: string;
}

export const NIGHT_FOCUS_OPTIONS: NightFocusOption[] = [
  { id: "peace", label: "Peace" },
  { id: "release", label: "Release" },
  { id: "trust", label: "Trust" },
  { id: "calm", label: "Calm" },
  { id: "self-love", label: "Self-Love" },
  { id: "let-go", label: "Let Go" }
];

export const isNightFocusBlock = (
  value: string | undefined
): value is NightFocusBlock =>
  NIGHT_FOCUS_OPTIONS.some((option) => option.id === value);

export const getNightFocusLabel = (focusBlock: NightFocusBlock) =>
  NIGHT_FOCUS_OPTIONS.find((option) => option.id === focusBlock)?.label ??
  focusBlock;
