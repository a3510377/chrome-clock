import { createStore, Store, useStore as baseUseStore } from "vuex";
import { InjectionKey } from "vue";

import configModule from "./Config";
import RootStateTypes, { AllStateTypes } from "./types";

export enum Modules {
  CONFIG = "config",
}

const store = createStore({
  modules: {
    [Modules.CONFIG]: configModule,
  },
});

export const key: InjectionKey<Store<RootStateTypes>> = Symbol("vue-store");
export type RootState = typeof key;
export default store;

export function useStore<T = AllStateTypes>() {
  return baseUseStore<T>(key);
}
