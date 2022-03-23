import { createStore, Store, useStore as baseUseStore } from "vuex";
import { InjectionKey } from "vue";

import configModule from "./Config";
import RootStateTypes, { AllStateTypes } from "./types";

export enum Modules {
  CONFIG = "config",
}

export const key: InjectionKey<Store<RootStateTypes>> = Symbol("vue-store");
export type RootState = typeof key;

const store = createStore<any>({
  state: { type: void 0 },
  modules: { [Modules.CONFIG]: configModule },
});

export default store;

export const useStore = <T = AllStateTypes>() => baseUseStore<T>(key);
