import db from "./db.ts";

export const defaultSettings: Settings = {
  color: { light: null, dark: null },
  image: {
    style: "cover",
    size: 100,
    opacity: 100,
    hue: 0,
    grayscale: 0,
    blur: 0,
  },
  closeTab: { pinned: true, grouped: true },
};

export default function chromeApi() {}

chromeApi.getSettings = async () => {
  const fallbackSettings = structuredClone(defaultSettings);
  let settings = await db.get("settings");
  if (!Object.keys(settings).length) {
    try {
      settings = (await chrome.storage.local.get(["page"])).page || fallbackSettings;
    } catch (_e) {
      settings = fallbackSettings;
    }
  }
  return settings;
};

chromeApi.saveSettings = async (settings: Settings, reset = false) => {
  await db.set("settings", settings);
  window.localStorage.setItem("page-color", JSON.stringify(settings.color));
  try {
    await chrome.storage.local.set({ page: settings });
  } catch (_e) {}
  if (reset) window.location.reload();
};

chromeApi.openShortcuts = () => {
  try {
    chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
  } catch (_e) {}
};
