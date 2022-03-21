export interface State {
  lave: { title?: string; laveTime?: Date };
  food: { schoolId?: string; schoolName?: string; open?: boolean };
}

export const state: State = {
  lave: {},
  food: {},
};
