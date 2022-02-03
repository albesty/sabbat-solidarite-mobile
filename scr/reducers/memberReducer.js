export const memberActions = {
  SEND_ADHESION_MESSAGE: 'SendAdhesionMessage',
  LOAD_USER_ASSOCIATION: 'LoadUserAssociation',
};

export const memberReducer = (state, action) => {
  switch (action.type) {
    case memberActions.SEND_ADHESION_MESSAGE:
      return { ...state, userAssociations: action.list };
    case memberActions.LOAD_USER_ASSOCIATION:
      return { ...state, userAssociations: action.list };
    default:
      return state;
  }
};
