import { defaultSettings } from "../api/chrome.ts";

async function getSettings() {
  return (await chrome.storage.local.get(["settings"])).settings || structuredClone(defaultSettings);
}

async function saveSettings(settings: Settings) {
  await chrome.storage.local.set({ settings });
}

async function getShortcut() {
  return (await chrome.commands.getAll())[1].shortcut;
}

chrome.tabs.onCreated.addListener(async (tab) => {
  const settings = await getSettings();
  if (settings.closeEmpty) return;
  (await chrome.tabs.query({ url: "chrome://newtab/" })).forEach((newTab) => {
    if (newTab.id && newTab.id !== tab.id) chrome.tabs.remove(newTab.id);
  });
});

async function closeTab() {
  const window = await chrome.windows.getCurrent({ populate: true });
  if (!window.tabs || window.tabs.length === 0) return;
  const tab = window.tabs.find((tab) => tab.active);
  if (!tab || !tab.id) return;
  const settings = await getSettings();

  const { closePinned, closeGrouped } = settings;
  if ((closePinned && tab.pinned) || (closeGrouped && tab.groupId !== -1)) return;

  // Filter the tabs to close based on the enabled protections.
  try {
    const tabs = window.tabs.filter((otherTab) => {
      return !otherTab.pinned && otherTab.groupId === -1 && otherTab.id !== tab.id;
    });
    if (!tabs.length) await chrome.tabs.create({});
    await chrome.tabs.remove(tab.id);
  } catch (_error) {}
}

chrome.runtime.onMessage.addListener((message, _sender, response) => {
  switch (message.type) {
    case "getSettings":
      getSettings().then((settings) => response(settings));
      return true;

    case "saveSettings":
      saveSettings(message.payload);
      break;

    case "getShortcut":
      getShortcut().then((shortcut) => response(shortcut));
      return true;
  }
});

chrome.commands.onCommand.addListener((command: string) => {
  if (command === "close") closeTab();
});
