import { Modules } from ".";
import { State as ConfigStateTypes } from "./Config/state";

export enum siteTypes {
  url = "url",
  local = "local",
  chromePlugin = "chromePlugin",
}

export default interface RootStateTypes {
  sitType: siteTypes | undefined;
}

export interface AllStateTypes extends RootStateTypes {
  [Modules.CONFIG]: ConfigStateTypes;
}
