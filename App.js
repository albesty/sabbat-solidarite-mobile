import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import { useFonts as UseRobotoFonts, Roboto_400Regular } from '@expo-google-fonts/roboto';
import { useFonts as useLobsterFonts, Lobster_400Regular } from '@expo-google-fonts/lobster';

import { colors } from './src/utils/styles';
import AuthContextProvider from './src/contexts/AuthContext';
import AssociationContextProvider from './src/contexts/AssociationContext';
import MemberContextProvider from './src/contexts/MemberContext';
import FileUploaderContextProvider from './src/contexts/FileUploaderContext';
import TransactionContextProvider from './src/contexts/TransactionContext';
import SelectedAssociationProvider from './src/contexts/SelectedAssociationContext';
import AppWrapper from './AppWrapper';
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'https://4454cb38dd09423b852d2de664929bc1@o1145696.ingest.sentry.io/6213342',
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});
export default function App() {
  let [robotoFontsLoaded] = UseRobotoFonts({
    Roboto_400Regular,
  });

  let [lobsterLoaded] = useLobsterFonts({
    Lobster_400Regular,
  });

  if (!robotoFontsLoaded || !lobsterLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <PaperProvider>
        <AuthContextProvider>
          <AssociationContextProvider>
            <MemberContextProvider>
              <FileUploaderContextProvider>
                <TransactionContextProvider>
                  <SelectedAssociationProvider>
                    <AppWrapper />
                  </SelectedAssociationProvider>
                </TransactionContextProvider>
              </FileUploaderContextProvider>
            </MemberContextProvider>
          </AssociationContextProvider>
        </AuthContextProvider>
      </PaperProvider>
      <StatusBar style="light" backgroundColor={colors.rougeBordeau} />
    </>
  );
}
