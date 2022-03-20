import { State } from "./state";

export enum MutationsTypes {
  setConfig = "setConfig",
}

// EX:
// [MutationsTypes.getBotInfo]: (state: S, data?: State["botInfo"]) => void;

export type Mutations<S = State> = {
  [MutationsTypes.setConfig]: (
    state: S,
    data: State & { $_updata?: boolean }
  ) => void;
};

export const mutations: Mutations<State> & Mutations = {
  [MutationsTypes.setConfig]: (state, data) => {
    if (data.$_updata !== false) {
      if (chrome.storage) chrome.storage.sync.set({ config: data });
      else localStorage.setItem("config", JSON.stringify(data));
    }
    data = <State>(
      (<unknown>(
        Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key,
            Object.fromEntries(
              Object.entries(value).map(([key, value]) => [
                key,
                value === null ? void 0 : value,
              ])
            ),
          ])
        )
      ))
    );

    state.food = { ...state.food, ...data.food };
    state.lave = { ...state.lave, ...data.lave };
  },
};
