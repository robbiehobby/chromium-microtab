import {
  ColorPickerValueChangeDetails,
  FileUploadFileChangeDetails,
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

handler.setColor = (state: State, details: ColorPickerValueChangeDetails) => {
  state.settings.color = details.value.toString("rgba");
};

handler.setImage = (state: State, details: FileUploadFileChangeDetails, dispatch: Dispatch) => {
  if (details.rejectedFiles.length) {
    state.errors.image = getMessage("imageError");
    return;
  }
  if (state.errors.image) delete state.errors.image;
  if (!details.acceptedFiles.length) {
    state.settings.image.filename = "";
    state.settings.image.data = "";
  } else {
    const file = details.acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => dispatch({ type: "setImageData", details: { file, reader } });
    reader.readAsDataURL(file);
  }
};

handler.setImageData = (state: State, details: { file: File; reader: FileReader }) => {
  state.settings.image.filename = details.file.name;
  state.settings.image.data = String(details.reader.result);
};

handler.removeImage = (state: State) => {
  state.settings.image = { ...defaultSettings.image };
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
  state.settings = { ...defaultSettings };
};

export default function pageReducer(prevState: State, action: Action) {
  const state = { ...prevState };
  if (handler[action.type]) handler[action.type](state, action.details, action.dispatch);
  chromeApi.saveSettings(state.settings);
  return state;
}
