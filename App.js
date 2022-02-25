import React, { useState } from 'react';
import { Image } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
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
  const [isReady, setIsReady] = useState(false);

  const cacheFonts = (fonts) => {
    return fonts.map((font) => Font.loadAsync(font));
  };

  const cacheImages = (images) => {
    return images.map((image) => {
      if (typeof image === 'string') {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
  };

  const loadingAssetsAsync = async () => {
    const assetImages = cacheImages([
      require('./assets/main_dans_la_main.jpg'),
      require('./assets/main_dans_la_main_2.jpg'),
      require('./assets/silhouette.png'),
    ]);

    const assetsFonts = cacheFonts([
      { Roboto_400Regular: require('./assets/Roboto-Regular.ttf') },
      { Lobster_400Regular: require('./assets/Lobster-Regular.ttf') },
    ]);
    await Promise.all([...assetsFonts, ...assetImages]);
  };

  if (!isReady) {
    return (
      <AppLoading
        startAsync={loadingAssetsAsync}
        onFinish={() => setIsReady(true)}
        onError={(error) => {
          throw new Error(error);
        }}
      />
    );
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
