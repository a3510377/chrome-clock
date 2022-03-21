import { State } from "./state";

export enum MutationsTypes {
  editConfig = "editConfig",
}

// EX:
// [MutationsTypes.getBotInfo]: (state: S, data?: State["botInfo"]) => void;

export type Mutations<S = State> = {
  [MutationsTypes.editConfig]: (state: S, data?: State) => void;
};

export const mutations: Mutations<State> & Mutations = {
  [MutationsTypes.editConfig](state, data) {
    state.food = { ...data?.food, ...state.food };
    state.lave = { ...data?.lave, ...state.lave };
  },
};
