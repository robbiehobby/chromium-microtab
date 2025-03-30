import chromeApi from "./apis/chrome.ts";

const mode = window.matchMedia("(prefers-color-scheme: dark)");
const handleMode = async () => {
  const settings = await chromeApi.getSettings();
  if (mode.matches) {
    document.body.className = "dark";
    document.body.style.backgroundColor = settings.color.dark;
  } else {
    document.body.className = "light";
    document.body.style.backgroundColor = settings.color.light;
  }
};
handleMode();
mode.addEventListener("change", () => handleMode());
