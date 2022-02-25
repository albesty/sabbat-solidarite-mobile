import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { colors } from '../../utils/styles';

export default function ShowImageScreen({ route }) {
  const currentImage = route.params.url;
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: currentImage }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: colors.bleuFbi,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
