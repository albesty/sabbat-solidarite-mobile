import React, { createContext, useMemo, useReducer } from 'react';
import { selectedAssoReducer } from '../reducers/selectedAssociationReducer';

export const SelectedAssociationContext = createContext();

const initialState = {
  selectedAssociation: {},
  connectedMember: {},
  allCotisations: [],
  associationMembers: [],
  associationCotisations: {},
  associationEngagements: [],
  engagementsVotes: {},
  update: false,
};
export default function SelectedAssociationProvider({ children }) {
  const [selectedAssoState, dispatchSelectedAsso] = useReducer(selectedAssoReducer, initialState);

  const contextValue = useMemo(() => {
    return { selectedAssoState, dispatchSelectedAsso };
  }, [selectedAssoState, dispatchSelectedAsso]);

  return (
    <SelectedAssociationContext.Provider value={contextValue}>
      {children}
    </SelectedAssociationContext.Provider>
  );
}
