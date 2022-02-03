import { View, Text } from 'react-native';
import React, { createContext, useMemo, useReducer } from 'react';
import { fileUploaderReducer } from '../reducers/fileUploaderReducer';

export const FileUplaoderContext = createContext();

const initialState = {
  signedRequestArray: [],
};

export default function FileUploaderContextProvider({ children }) {
  const [uploadState, dispatch] = useReducer(fileUploaderReducer, initialState);

  const contextValue = useMemo(() => {
    return { uploadState, dispatch };
  }, [uploadState, dispatch]);

  return (
    <FileUplaoderContext.Provider value={contextValue}>{children}</FileUplaoderContext.Provider>
  );
}
