type ImageStyle = "cover" | "repeat" | "center";

interface Settings {
  color: { light: string | null; dark: string | null };
  image: {
    blob?: File;
    style: ImageStyle;
    size: number;
    opacity: number;
    hue: number;
    grayscale: number;
    blur: number;
  };
  close: { pinned: boolean; grouped: boolean };
}

type Errors = { [key: string]: string };

interface State {
  settings: Settings;
  errors: Errors;
}
