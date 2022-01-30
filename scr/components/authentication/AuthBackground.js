import React from 'react';
import { ImageBackground, StyleSheet, View, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors, fonts, sizes } from '../../utils/styles';
import AppText from '../common/AppText';

export default function BackgroundScreen({ children }) {
  return (
    <>
      <ImageBackground
        source={require('../../../assets/main_dans_la_main_2.jpg')}
        style={styles.container}
      >
        <View style={styles.cover} />
        <LottieView
          autoPlay={true}
          loop={true}
          style={styles.animation}
          source={require('../../../assets/lottie_animation.json')}
        />
        <View style={styles.contentContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <AppText style={styles.textStyle}>Sabbat-Solidarité</AppText>
            {children}
          </ScrollView>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cover: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
    opacity: 0.4,
  },
  contentContainer: {
    width: '90%',
    padding: 30,
    backgroundColor: colors.white,
    opacity: 0.8,
  },
  textStyle: {
    fontFamily: fonts.titleFont,
    fontSize: sizes.titleSize,
    alignSelf: 'center',
    marginBottom: 20,
  },
  animation: {
    position: 'absolute',
  },
});
