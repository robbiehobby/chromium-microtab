export const defaultImageSettings = {
  data: "",
  style: "cover",
  size: "100",
  opacity: "100",
  hue: "0",
  grayscale: "0",
  blur: "0",
};
export type Image = typeof defaultImageSettings;

export const defaultTabSettings = {
  protectPinned: true,
  protectGroups: true,
};
export type Tab = typeof defaultTabSettings;

export const defaultSettings = {
  color: "",
  image: defaultImageSettings,
  tab: defaultTabSettings,
};
export type Settings = typeof defaultSettings;
