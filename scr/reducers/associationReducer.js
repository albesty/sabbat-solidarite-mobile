export const associationsActions = {
  ADD_NEW: 'AddNewAssociation',
  GET_ALL: 'GetAllAssociation',
};
export const associationReducer = (state, action) => {
  switch (action.type) {
    case associationsActions.ADD_NEW:
      const newAssociationList = [...state.list, action.association];
      return { ...state, list: newAssociationList };
    case associationsActions.GET_ALL:
      return { ...state, list: action.list };
    default:
      return state;
  }
};
