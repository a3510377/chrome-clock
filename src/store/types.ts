import { Modules } from ".";
import { State as ConfigStateTypes } from "./Config/state";

export default interface RootStateTypes {}

export interface AllStateTypes extends RootStateTypes {
  [Modules.CONFIG]: ConfigStateTypes;
}
