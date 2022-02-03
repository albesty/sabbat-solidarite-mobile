import React, { createContext, useMemo, useReducer } from 'react';
import { associationReducer } from '../reducers/associationReducer';

export const AssociationContext = createContext();

const initialState = {
  list: [],
};

export default function AssociationContextProvider({ children }) {
  const [associationState, dispatch] = useReducer(associationReducer, initialState);

  const contextValue = useMemo(() => {
    return { associationState, dispatch };
  }, [associationState, dispatch]);

  return <AssociationContext.Provider value={contextValue}>{children}</AssociationContext.Provider>;
}
