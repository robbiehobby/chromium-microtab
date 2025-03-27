import { defaultSettings } from "../hooks/chrome.ts";

chrome.commands.onCommand.addListener(async (command: string) => {
  if (command !== "close-tab") return;

  const window = await chrome.windows.getCurrent({ populate: true });
  if (!window.tabs || window.tabs.length === 0) return;
  const tab = window.tabs.find((tab) => tab.active);
  if (!tab || !tab.id) return;
  const settings: typeof defaultSettings = (await chrome.storage.local.get(["page"])).page || defaultSettings;

  // Check which close tab protections are enabled.
  const { pinned, grouped } = settings.closeTab;
  if ((pinned && tab.pinned) || (grouped && tab.groupId !== -1)) return;

  try {
    const tabs = window.tabs.filter((otherTab) => {
      // Filter the tabs to close based on the enabled protections.
      return !otherTab.pinned && otherTab.groupId === -1 && otherTab.id !== tab.id;
    });
    if (!tabs.length) {
      if (tab.url?.match(/^\w+:\/\/newtab\//)) return;
      await chrome.tabs.create({});
    }
    await chrome.tabs.remove(tab.id);
  } catch (_e) {}
});
