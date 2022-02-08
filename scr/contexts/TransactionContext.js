import React, { createContext, useMemo, useReducer } from 'react';
import { transactionReducer } from '../reducers/transactionReducer';

export const TransactionContext = createContext();

const initialState = {
  transactionList: [],
};
export default function TransactionContextProvider({ children }) {
  const [transactionState, dispatchTransaction] = useReducer(transactionReducer, initialState);

  const contextValue = useMemo(() => {
    return { transactionState, dispatchTransaction };
  }, [transactionState, dispatchTransaction]);

  return <TransactionContext.Provider value={contextValue}>{children}</TransactionContext.Provider>;
}
