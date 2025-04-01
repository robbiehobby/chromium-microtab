import { defaultSettings } from "../api/chrome.ts";

async function getSettings(): Promise<Settings> {
  return (await chrome.storage.local.get(["page"])).page || defaultSettings;
}

chrome.tabs.onCreated.addListener(async (tab) => {
  const settings = await getSettings();
  if (settings.close.empty) return;
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

  const { pinned, grouped } = settings.close;
  if ((pinned && tab.pinned) || (grouped && tab.groupId !== -1)) return;

  // Filter the tabs to close based on the enabled protections.
  try {
    const tabs = window.tabs.filter((otherTab) => {
      return !otherTab.pinned && otherTab.groupId === -1 && otherTab.id !== tab.id;
    });
    if (!tabs.length) await chrome.tabs.create({});
    await chrome.tabs.remove(tab.id);
  } catch (_error) {}
}

chrome.commands.onCommand.addListener((command: string) => {
  if (command === "close") closeTab();
});
