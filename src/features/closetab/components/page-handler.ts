import chromeApi, { defaultSettings } from "../api/chrome.ts";

type Action = { type: string; value: any; dispatch?: (action: Action) => void };

const handler: { [key: string]: Function } = {};

handler.loadSettings = async (state: State, value: Settings) => {
  state.settings = { ...value };
};

handler.setClosePinned = (state: State, value: any) => {
  state.settings.closePinned = value;
};

handler.setCloseGrouped = (state: State, value: any) => {
  state.settings.closeGrouped = value;
};

handler.setCloseEmpty = (state: State, value: any) => {
  state.settings.closeEmpty = value;
};

handler.reset = (state: State) => {
  state.settings = structuredClone(defaultSettings);
};

export default function pageReducer(prevState: State, action: Action) {
  const state = { ...prevState };
  if (handler[action.type]) handler[action.type](state, action.value);
  chromeApi.saveSettings(state.settings);
  return state;
}
