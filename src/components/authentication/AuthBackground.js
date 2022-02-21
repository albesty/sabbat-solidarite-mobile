import React from 'react';
import { ImageBackground, StyleSheet, View, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors, fonts, sizes } from '../../utils/styles';
import AppText from '../common/AppText';

export default function BackgroundScreen({ error, children }) {
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
            <View style={styles.sloganContainer}>
              <AppText style={styles.textStyle}>Sabbat-Solidarité</AppText>
              <AppText style={styles.slogan}>Unis, nous sommes plus forts.</AppText>
            </View>
            {error && <AppText style={styles.error}>{error}</AppText>}
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
  },
  animation: {
    position: 'absolute',
  },
  error: {
    fontFamily: fonts.contentFont,
    color: colors.rouge,
    alignSelf: 'center',
    marginBottom: 10,
  },
  slogan: {
    fontSize: 12,
    fontFamily: fonts.titleFont,
    marginTop: -10,
  },
  sloganContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
});
