import {
  ColorPickerValueChangeDetails,
  FileUploadFileAcceptDetails,
  SegmentGroupValueChangeDetails,
  SliderValueChangeDetails,
  SwitchCheckedChangeDetails,
} from "@chakra-ui/react";
import chromeApi, { defaultSettings } from "../api/chrome.ts";

type Action = { type: string; details: any; dispatch?: (action: Action) => void };

const handler: { [key: string]: Function } = {};

handler.loadSettings = async (state: State, details: Settings) => {
  state.settings = { ...details };
};

handler.setLightColor = (state: State, details: ColorPickerValueChangeDetails) => {
  state.settings.color.light = details.value.toString("rgba");
};

handler.setDarkColor = (state: State, details: ColorPickerValueChangeDetails) => {
  state.settings.color.dark = details.value.toString("rgba");
};

handler.setImageError = (state: State) => {
  state.errors.image = chromeApi.getMessage("imageError");
};

handler.setImage = (state: State, details: FileUploadFileAcceptDetails) => {
  if (!details.files.length) return;
  if (state.errors.image) delete state.errors.image;
  const file = details.files[0];
  state.settings.image.blob = file;
};

handler.removeImage = (state: State) => {
  state.settings.image = structuredClone(defaultSettings.image);
};

handler.setImageStyle = (state: State, details: SegmentGroupValueChangeDetails) => {
  state.settings.image.style = String(details.value) as ImageStyle;
};

handler.setImageSize = (state: State, details: SliderValueChangeDetails) => {
  state.settings.image.size = Number(details.value[0]);
};

handler.setImageOpacity = (state: State, details: SliderValueChangeDetails) => {
  state.settings.image.opacity = Number(details.value[0]);
};

handler.setImageHue = (state: State, details: SliderValueChangeDetails) => {
  state.settings.image.hue = Number(details.value[0]);
};

handler.setImageGrayscale = (state: State, details: SliderValueChangeDetails) => {
  state.settings.image.grayscale = Number(details.value[0] / 100);
};

handler.setImageBlur = (state: State, details: SliderValueChangeDetails) => {
  state.settings.image.blur = Number(details.value[0]);
};

handler.setCloseTabPinned = (state: State, details: SwitchCheckedChangeDetails) => {
  state.settings.closeTab.pinned = details.checked;
};

handler.setCloseTabGrouped = (state: State, details: SwitchCheckedChangeDetails) => {
  state.settings.closeTab.grouped = details.checked;
};

handler.reset = (state: State) => {
  state.settings = structuredClone(defaultSettings);
};

export default function pageReducer(prevState: State, action: Action) {
  const state = { ...prevState };
  if (handler[action.type]) handler[action.type](state, action.details);
  chromeApi.saveSettings(state.settings, action.type === "reset");
  return state;
}
