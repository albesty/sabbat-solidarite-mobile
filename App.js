import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import { useFonts as UseRobotoFonts, Roboto_400Regular } from '@expo-google-fonts/roboto';
import { useFonts as useLobsterFonts, Lobster_400Regular } from '@expo-google-fonts/lobster';

import { colors } from './scr/utils/styles';
import AuthNavigator from './scr/navigation/AuthNavigator';
import AuthContextProvider from './scr/contexts/AuthContext';
import AssociationContextProvider from './scr/contexts/AssociationContext';
import MemberContextProvider from './scr/contexts/MemberContext';
import FileUploaderContextProvider from './scr/contexts/FileUploaderContext';

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
                <NavigationContainer>
                  <AuthNavigator />
                </NavigationContainer>
              </FileUploaderContextProvider>
            </MemberContextProvider>
          </AssociationContextProvider>
        </AuthContextProvider>
      </PaperProvider>
      <StatusBar style="light" backgroundColor={colors.rougeBordeau} />
    </>
  );
}
