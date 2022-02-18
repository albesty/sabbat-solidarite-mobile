export const associationsActions = {
  ADD_NEW: 'AddNewAssociation',
  GET_ALL: 'GetAllAssociation',
  update_avatar: 'UPDATE_AVATAR',
};
export const associationReducer = (state, action) => {
  switch (action.type) {
    case associationsActions.ADD_NEW:
      const justAdded = action.association;
      const addedIndex = state.list.findIndex((ass) => ass.id === justAdded.id);
      let newAssociationList = state.list;
      if (addedIndex !== -1) {
        newAssociationList[addedIndex] = justAdded;
      } else {
        newAssociationList.push(justAdded);
      }
      return { ...state, list: newAssociationList };
    case associationsActions.GET_ALL:
      return { ...state, list: action.list };
    case 'UPDATE_AVATAR':
      let associationList = state.list;
      const updated = action.association;
      const updatedIndex = associationList.findIndex((item) => item.id === updated.id);
      associationList[updatedIndex] = updated;
      return { ...state, list: associationList };
    default:
      return state;
  }
};
