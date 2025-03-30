export const defaultSettings: Settings = {
  color: null,
  image: {
    filename: "",
    data: "",
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
  const settings = structuredClone(defaultSettings);
  try {
    return (await chrome.storage.local.get(["page"])).page || settings;
  } catch (_e) {
    try {
      return JSON.parse(window.localStorage.getItem("page") || "");
    } catch (_e) {
      return settings;
    }
  }
};

chromeApi.saveSettings = async (settings: typeof defaultSettings) => {
  try {
    await chrome.storage.local.set({ page: settings });
  } catch (_e) {
    window.localStorage.setItem("page", JSON.stringify(settings));
  }
};

chromeApi.openShortcuts = () => {
  try {
    chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
  } catch (_e) {}
};
