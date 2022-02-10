import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import { useFonts as UseRobotoFonts, Roboto_400Regular } from '@expo-google-fonts/roboto';
import { useFonts as useLobsterFonts, Lobster_400Regular } from '@expo-google-fonts/lobster';

import { colors } from './src/utils/styles';
import AuthNavigator from './src/navigation/AuthNavigator';
import AuthContextProvider from './src/contexts/AuthContext';
import AssociationContextProvider from './src/contexts/AssociationContext';
import MemberContextProvider from './src/contexts/MemberContext';
import FileUploaderContextProvider from './src/contexts/FileUploaderContext';
import TransactionContextProvider from './src/contexts/TransactionContext';
import SelectedAssociationProvider from './src/contexts/SelectedAssociationContext';

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
                    <NavigationContainer>
                      <AuthNavigator />
                    </NavigationContainer>
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
