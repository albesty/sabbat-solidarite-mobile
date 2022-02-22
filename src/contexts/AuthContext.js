import React, { createContext, useReducer, useMemo } from 'react';
import { authReducer } from '../reducers/authReducer';

export const AuthContext = createContext();

const initialState = {
  loading: false,
  updateState: false,
  error: null,
  user: null,
  devicePushToken: '',
  selectedUser: null,
};
export default function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
