import {
  ColorPickerValueChangeDetails,
  FileUploadFileChangeDetails,
  SegmentGroupValueChangeDetails,
  SliderValueChangeDetails,
  SwitchCheckedChangeDetails,
} from "@chakra-ui/react";
import { PageState } from "./page.tsx";
import { defaultSettings, useChrome } from "../hooks/chrome.ts";
import getMessage from "../i18n.ts";

export default function pageHandler() {}

pageHandler.save = (settings: typeof defaultSettings, state: PageState) => {
  state.setSettings(settings);
  useChrome().saveSettings(settings);
};

pageHandler.color = (details: ColorPickerValueChangeDetails, state: PageState) => {
  const settings = { ...state.settings };
  settings.color = details.value.toString("rgba");
  pageHandler.save(settings, state);
};

pageHandler.image = (details: FileUploadFileChangeDetails, state: PageState) => {
  const { errors } = state;
  if (details.rejectedFiles.length) {
    state.setErrors({ ...errors, image: getMessage("imageError") });
    return;
  }
  if (errors.image) state.setErrors({ ...errors, image: undefined });

  if (!details.acceptedFiles.length) {
    const settings = { ...state.settings };
    settings.image.filename = "";
    settings.image.data = "";
    pageHandler.save(settings, state);
    return;
  }

  const file = details.acceptedFiles[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    const settings = { ...state.settings };
    settings.image.filename = file.name;
    settings.image.data = String(reader.result);
    pageHandler.save(settings, state);
  };
  reader.readAsDataURL(file);
};

pageHandler.imageRemove = (state: PageState) => {
  const settings = { ...state.settings };
  settings.image = structuredClone(defaultSettings.image);
  pageHandler.save(settings, state);
};

pageHandler.imageStyle = (details: SegmentGroupValueChangeDetails, state: PageState) => {
  const settings = { ...state.settings };
  settings.image.style = String(details.value);
  pageHandler.save(settings, state);
};

pageHandler.imageSize = (details: SliderValueChangeDetails, state: PageState) => {
  const settings = { ...state.settings };
  settings.image.size = Number(details.value[0]);
  pageHandler.save(settings, state);
};

pageHandler.imageOpacity = (details: SliderValueChangeDetails, state: PageState) => {
  const settings = { ...state.settings };
  settings.image.opacity = Number(details.value[0]);
  pageHandler.save(settings, state);
};

pageHandler.imageHue = (details: SliderValueChangeDetails, state: PageState) => {
  const settings = { ...state.settings };
  settings.image.hue = Number(details.value[0]);
  pageHandler.save(settings, state);
};

pageHandler.imageGrayscale = (details: SliderValueChangeDetails, state: PageState) => {
  const settings = { ...state.settings };
  settings.image.grayscale = Number(details.value[0] / 100);
  pageHandler.save(settings, state);
};

pageHandler.imageBlur = (details: SliderValueChangeDetails, state: PageState) => {
  const settings = { ...state.settings };
  settings.image.blur = Number(details.value[0]);
  pageHandler.save(settings, state);
};

pageHandler.closeTabPinned = (details: SwitchCheckedChangeDetails, state: PageState) => {
  const settings = { ...state.settings };
  settings.closeTab.pinned = details.checked;
  pageHandler.save(settings, state);
};

pageHandler.closeTabGrouped = (details: SwitchCheckedChangeDetails, state: PageState) => {
  const settings = { ...state.settings };
  settings.closeTab.grouped = details.checked;
  pageHandler.save(settings, state);
};

pageHandler.reset = (state: PageState) => {
  if (!window.confirm(getMessage("resetConfirm"))) return;

  document
    .querySelectorAll("button[data-clear]")
    .forEach((btn) => btn.dispatchEvent(new MouseEvent("click", { bubbles: true })));

  pageHandler.save(structuredClone(defaultSettings), state);
  useChrome().resetSettings();
};
