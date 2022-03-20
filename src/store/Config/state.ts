export interface State {
  lave: { title?: string; laveTime?: Date };
  food: { schoolId?: string; schoolName?: string };
}

export const state: State = {
  lave: {},
  food: {},
};
