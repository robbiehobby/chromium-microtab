import {
  ColorPickerValueChangeDetails,
  FileUploadFileChangeDetails,
  SegmentGroupValueChangeDetails,
  SliderValueChangeDetails,
  SwitchCheckedChangeDetails,
} from "@chakra-ui/react";
import { PageState } from "./page.tsx";
import { defaultValues } from "../hooks/storage.ts";

export default function pageHandler() {}

pageHandler.color = (details: ColorPickerValueChangeDetails, state: PageState) => {
  state.setValues({ ...state.values, color: details.value.toString("rgba") });
};

pageHandler.image = (details: FileUploadFileChangeDetails, state: PageState) => {
  const { errors } = state;

  if (details.rejectedFiles.length) return state.setErrors({ ...errors, image: "Maximum allowed size is 8 MB." });
  if (errors.image) state.setErrors({ ...errors, image: undefined });
  if (!details.acceptedFiles.length) return state.setValues({ ...state.values, imageName: "", imageData: "" });

  const file = details.acceptedFiles[0];
  const reader = new FileReader();
  reader.onloadend = () => state.setValues({ ...state.values, imageName: file.name, imageData: String(reader.result) });
  reader.readAsDataURL(file);
};

pageHandler.imageRemove = (state: PageState) => {
  const values = defaultValues;

  state.setValues({
    ...state.values,
    imageName: "",
    imageData: "",
    imageStyle: values.imageStyle,
    imageSize: values.imageSize,
    imageOpacity: values.imageOpacity,
    imageHue: values.imageHue,
    imageGrayscale: values.imageGrayscale,
    imageBlur: values.imageBlur,
  });
};

pageHandler.imageStyle = (details: SegmentGroupValueChangeDetails, state: PageState) => {
  state.setValues({ ...state.values, imageStyle: details.value });
};

pageHandler.imageSize = (details: SliderValueChangeDetails, state: PageState) => {
  state.setValues({ ...state.values, imageSize: details.value[0] });
};

pageHandler.imageOpacity = (details: SliderValueChangeDetails, state: PageState) => {
  state.setValues({ ...state.values, imageOpacity: details.value[0] });
};

pageHandler.imageHue = (details: SliderValueChangeDetails, state: PageState) => {
  state.setValues({ ...state.values, imageHue: details.value[0] });
};

pageHandler.imageGrayscale = (details: SliderValueChangeDetails, state: PageState) => {
  state.setValues({ ...state.values, imageGrayscale: details.value[0] / 100 });
};

pageHandler.imageBlur = (details: SliderValueChangeDetails, state: PageState) => {
  state.setValues({ ...state.values, imageBlur: details.value[0] });
};

pageHandler.closeTabPinned = (details: SwitchCheckedChangeDetails, state: PageState) => {
  state.setValues({ ...state.values, closeTabPinned: details.checked });
};

pageHandler.closeTabGrouped = (details: SwitchCheckedChangeDetails, state: PageState) => {
  state.setValues({ ...state.values, closeTabGrouped: details.checked });
};
