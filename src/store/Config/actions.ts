import axios from "axios";
import { ActionContext, ActionTree } from "vuex";

import { RootState } from "..";
import { State } from "./state";

export enum ActionsType {
  setConfig = "setConfig",
}

// EX:
// [ActionsType.test]: (
//   ctx: ActionContext<State, RootState>
// ) => Promise<void>;

export type Actions = {
  [ActionsType.setConfig]: (
    ctx: ActionContext<State, RootState>,
    data: State & { $_updata?: boolean }
  ) => Promise<void>;
};

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionsType.setConfig]: async (ctx, data) => {
    const state = ctx.state;
    if (data.$_updata !== false && chrome.storage)
      chrome.storage.sync.set({ config: data });
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
    if (
      data.food.schoolName !== state.food.schoolName ||
      data.food.schoolId !== state.food.schoolId
    ) {
      const { data: schoolData } = await axios({
        url: `https://fatraceschool.k12ea.gov.tw/school?SchoolName=%E7%AB%B9%E6%A9%8B`,
        method: "GET",
      });
      schoolData;
    }
    state.food = { ...state.food, ...data.food };
    state.lave = { ...state.lave, ...data.lave };
  },
};
