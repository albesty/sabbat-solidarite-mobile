export const selectedAssoActions = {
  select_one: 'SELECT_ONE',
  asso_members: 'SELECTED_ASSO_MEMBERS',
  asso_cotisations: 'SELECTED_ASSO_COTISATIONS',
  respond_to_adhesion: 'RESPOND_TO_ADHESION_MESSAGE',
  add_cotisation: 'ADD_COTISATION',
  all_cotisations: 'GET_ALL_COTISATIONS',
  pay_cotisation: 'PAY_COTISATION',
  add_engagement: 'ADD_ENGEGEMENT',
  all_engagements: 'GET_ALL_ENGAGEMENTS',
  all_engagements_votes: 'GET_ALL_ENGAGEMENTS_VOTES',
  vote_engagement: 'VOTE_ENGAGEMENT',
  pay_tranche: 'PAY_TRANCHE',
};

export const selectedAssoReducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_ONE':
      return { ...state, selectedAssociation: action.selected };
    case 'SELECTED_ASSO_MEMBERS':
      const allMembers = action.members;
      const connectedMember = allMembers.find((item) => item.id === action.connectedUserId);
      return { ...state, associationMembers: allMembers, connectedMember };
    case 'RESPOND_TO_ADHESION_MESSAGE':
      let newMembers = state.associationMembers;
      const newMember = action.member;
      newMembers[newMember.id] = newMember;
      return { ...state, associationMembers: newMembers };
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
    case 'ADD_ENGEGEMENT':
      const newEngagements = [...state.associationEngagements, action.engagement];
      return { ...state, associationEngagements: newEngagements };
    case 'GET_ALL_ENGAGEMENTS':
      return { ...state, associationEngagements: action.engagements };
    case 'GET_ALL_ENGAGEMENTS_VOTES':
      return { ...state, engagementsVotes: action.allVotes };
    case 'VOTE_ENGAGEMENT':
      let newVoteObject = state.engagementsVotes;
      const justVoted = action.votedEngagement.justVoted;
      const justVotedVotes = action.votedEngagement.engagementVotes;
      newVoteObject[justVoted.id] = justVotedVotes;
      return { ...state, engagementsVotes: newVoteObject };
    case 'PAY_TRANCHE':
      let newEngagementsList = state.associationEngagements;
      const justUpdated = action.engagement;
      const udpadtedIndex = newEngagementsList.findIndex((engage) => engage.id === justUpdated.id);
      newEngagementsList[udpadtedIndex] = justUpdated;
      return { ...state, associationEngagements: newEngagementsList };
    default:
      return state;
  }
};
