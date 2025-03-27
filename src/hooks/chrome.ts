export const defaultSettings = {
  color: null as string | null,
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
  closeTab: {
    pinned: true,
    grouped: true,
  },
};

export function useChrome() {
  const getSettings = async () => {
    try {
      return (await chrome.storage.local.get(["page"])).page || defaultSettings;
    } catch (_e) {
      return JSON.parse(window.localStorage.getItem("page") || "");
    }
  };

  const saveSettings = async (settings: typeof defaultSettings) => {
    try {
      await chrome.storage.local.set({ page: settings });
    } catch (_e) {
      window.localStorage.setItem("page", JSON.stringify(settings));
    }
  };

  const openShortcuts = () => {
    try {
      chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
    } catch (_e) {}
  };

  return { getSettings, saveSettings, openShortcuts };
}
