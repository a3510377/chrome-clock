import axios from "axios";
import { ActionContext, ActionTree } from "vuex";

import { RootState } from "..";
import { findSchool } from "@/@types/food";
import { State } from "./state";

export enum ActionsType {
  setConfig = "setConfig",
}

export type Actions = {
  [ActionsType.setConfig]: (
    ctx: ActionContext<State, RootState>,
    data: State & { $_updata?: boolean }
  ) => Promise<void>;
};

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionsType.setConfig]: async ({ state }, data) => {
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
      (data.food?.schoolName !== state.food?.schoolName &&
        data.food?.schoolName) ||
      (data.food?.schoolId !== state.food?.schoolId && data.food?.schoolId)
    ) {
      const { data: find_data } = await axios({
        url: `https://fatraceschool.k12ea.gov.tw/school?SchoolName=${data.food.schoolName}`,
        method: "GET",
      });
      let { data: schoolData } = <findSchool>find_data;
      data ||= { food: {}, lave: {} };
      console.log(schoolData);

      if (schoolData.length) {
        data.$_updata = true;
        data.food.schoolId = schoolData[0].SchoolId.toString();
        data.food.schoolName = schoolData[0].SchoolName;
      }
    }

    if (data.$_updata !== false && chrome?.storage)
      chrome.storage.local.set({ config: data });
    state.food = { ...state.food, ...data.food };
    state.lave = { ...state.lave, ...data.lave };
  },
};
