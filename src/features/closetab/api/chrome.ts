import messagesJson from "../../../locales/en/messages.json";

export const defaultSettings: Settings = {
  closePinned: true,
  closeGrouped: true,
  closeEmpty: false,
};

const messages = messagesJson as {
  [key: string]: { message: string };
};

export default function chromeApi() {}

chromeApi.getMessage = (key: string, substitutions?: string | string[]): string => {
  try {
    return chrome.i18n.getMessage(key, substitutions);
  } catch (_error) {
    return messages[key].message || "";
  }
};

chromeApi.getSettings = async () => {
  try {
    return await chrome.runtime.sendMessage({ type: "getSettings" });
  } catch (_error) {
    return structuredClone(defaultSettings);
  }
};

chromeApi.saveSettings = async (settings: Settings) => {
  try {
    await chrome.runtime.sendMessage({ type: "saveSettings", payload: settings });
  } catch (_error) {}
};

chromeApi.getShortcut = async () => {
  try {
    return await chrome.runtime.sendMessage({ type: "getShortcut" });
  } catch (_error) {
    return "";
  }
};

chromeApi.openShortcuts = () => {
  try {
    chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
  } catch (_error) {}
};
