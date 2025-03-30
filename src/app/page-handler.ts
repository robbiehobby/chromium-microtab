import {
  ColorPickerValueChangeDetails,
  FileUploadFileAcceptDetails,
  SegmentGroupValueChangeDetails,
  SliderValueChangeDetails,
  SwitchCheckedChangeDetails,
} from "@chakra-ui/react";
import chromeApi, { defaultSettings } from "../apis/chrome.ts";
import getMessage from "../i18n.ts";

type Action = { type: string; details: any; dispatch?: (action: Action) => void };
type Dispatch = (action: Action) => void;

const handler: { [key: string]: Function } = {};

handler.loadSettings = (state: State, details: Settings) => {
  state.settings = { ...details };
};

handler.setLightColor = (state: State, details: ColorPickerValueChangeDetails) => {
  state.settings.color.light = details.value.toString("rgba");
};

handler.setDarkColor = (state: State, details: ColorPickerValueChangeDetails) => {
  state.settings.color.dark = details.value.toString("rgba");
};

handler.setImageError = (state: State) => {
  state.errors.image = getMessage("imageError");
};

handler.setImage = (_state: State, details: FileUploadFileAcceptDetails, dispatch: Dispatch) => {
  if (!details.files.length) return;
  const file = details.files[0];
  const reader = new FileReader();
  reader.onloadend = () => dispatch({ type: "setImageData", details: { file, reader } });
  reader.readAsDataURL(file);
};

handler.setImageData = (state: State, details: { file: File; reader: FileReader }) => {
  if (state.errors.image) delete state.errors.image;
  state.settings.image.filename = details.file.name;
  state.settings.image.data = String(details.reader.result);
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
  if (handler[action.type]) handler[action.type](state, action.details, action.dispatch);
  chromeApi.saveSettings(state.settings);
  if (action.type === "reset") window.location.reload();
  return state;
}
