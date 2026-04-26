export type MorningFocusBlock =
  | "confidence"
  | "abundance"
  | "love"
  | "calm"
  | "trust"
  | "clarity";

export interface MorningFocusOption {
  id: MorningFocusBlock;
  label: string;
}

export const MORNING_FOCUS_OPTIONS: MorningFocusOption[] = [
  { id: "confidence", label: "Confidence" },
  { id: "abundance", label: "Abundance" },
  { id: "love", label: "Love" },
  { id: "calm", label: "Calm" },
  { id: "trust", label: "Trust" },
  { id: "clarity", label: "Clarity" }
];

export const isMorningFocusBlock = (
  value: string | undefined
): value is MorningFocusBlock =>
  MORNING_FOCUS_OPTIONS.some((option) => option.id === value);

export const getMorningFocusLabel = (focusBlock: MorningFocusBlock) =>
  MORNING_FOCUS_OPTIONS.find((option) => option.id === focusBlock)?.label ??
  focusBlock;
