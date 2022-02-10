export const selectedAssoActions = {
  select_one: 'SELECT_ONE',
  asso_members: 'SELECTED_ASSO_MEMBERS',
  asso_cotisations: 'SELECTED_ASSO_COTISATIONS',
  add_cotisation: 'ADD_COTISATION',
  all_cotisations: 'GET_ALL_COTISATIONS',
  pay_cotisation: 'PAY_COTISATION',
};

export const selectedAssoReducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_ONE':
      return { ...state, selectedAssociation: action.selected };
    case 'SELECTED_ASSO_MEMBERS':
      const allMembers = action.members;
      const connectedMember = allMembers.find((item) => item.id === action.connectedUserId);
      return { ...state, associationMembers: allMembers, connectedMember };
    case 'SELECTED_ASSO_COTISATIONS':
      return { ...state, associationCotisations: action.cotisations };
    case 'ADD_COTISATION':
      const newList = [...state.allCotisations, action.cotisation];
      return { ...state, allCotisations: newList };
    case 'GET_ALL_COTISATIONS':
      return { ...state, allCotisations: action.cotisations };
    case 'PAY_COTISATION':
      let newCotisationState = state.associationCotisations;
      const newUpdatedCotisations = action.memberCotisation.cotisations;
      newCotisationState[newUpdatedCotisations[0].member_cotisation.memberId] =
        newUpdatedCotisations;
      return { ...state, associationCotisations: newCotisationState };
    default:
      return state;
  }
};
