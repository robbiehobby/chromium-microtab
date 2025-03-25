export const defaultValues = {
  color: null as string | null,
  imageName: "",
  imageData: "",
  imageStyle: "cover",
  imageSize: 100,
  imageOpacity: 100,
  imageHue: 0,
  imageGrayscale: 0,
  imageBlur: 0,
  closeTabPinned: true,
  closeTabGrouped: true,
};

export default function useStorage() {
  const getSettings = async (): Promise<typeof defaultValues> => {
    try {
      const data = await chrome.storage.local.get(["settings"]);
      return data.settings;
    } catch (_e) {
      return JSON.parse(window.localStorage.getItem("settings") || "{}");
    }
  };

  const setSettings = async (values: typeof defaultValues) => {
    try {
      await chrome.storage.local.set({ settings: values });
    } catch (_e) {
      window.localStorage.setItem("settings", JSON.stringify(values));
    }
  };

  return { getSettings, setSettings };
}
