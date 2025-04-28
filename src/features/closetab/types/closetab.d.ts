interface Settings {
  closePinned: boolean;
  closeGrouped: boolean;
  closeEmpty: boolean;
}

type Errors = { [key: string]: string };

interface State {
  settings: Settings;
  errors: Errors;
}
