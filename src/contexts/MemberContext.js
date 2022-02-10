import React, { createContext, useMemo, useReducer } from 'react';
import { memberReducer } from '../reducers/memberReducer';

export const MemberContext = createContext();

const initialState = {
  userAssociations: [],
};

export default function MemberContextProvider({ children }) {
  const [memberState, dispatch] = useReducer(memberReducer, initialState);

  const contextValue = useMemo(() => {
    return { memberState, dispatch };
  }, [memberState, dispatch]);

  return <MemberContext.Provider value={contextValue}>{children}</MemberContext.Provider>;
}
