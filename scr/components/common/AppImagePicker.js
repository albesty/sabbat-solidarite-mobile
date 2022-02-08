import { StyleSheet, View, Modal } from 'react-native';
import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../utils/styles';
import AppText from '../common/AppText';
import AppIconButton from './AppIconButton';
import AppSpacer from './AppSpacer';

export default function AppImagePicker({ onSelectImage, imageModalVisible, onCloseImageModal }) {
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        base64: true,
        quality: 1,
      });
      if (result.cancelled) return;
      onSelectImage({ url: result.uri, imageData: result.base64 });
    } catch (error) {
      throw new Error(error);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
        base64: true,
      });
      if (result.cancelled) return;
      onSelectImage({ url: result.uri, imageData: result.base64 });
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <Modal visible={imageModalVisible} transparent>
      <View style={styles.mainContainer}></View>
      <View style={styles.contentContainer}>
        <AppIconButton
          onPress={onCloseImageModal}
          color={colors.rougeBordeau}
          style={styles.close}
          icon="close"
        />
        <View style={styles.textContainer}>
          <AppText onPress={takePhoto} style={styles.text}>
            Prendre une photo
          </AppText>
          <AppSpacer />
          <AppSpacer />
          <AppText onPress={pickImage} style={styles.text}>
            Choisir une image
          </AppText>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.black,
    opacity: 0.2,
  },
  contentContainer: {
    position: 'absolute',
    backgroundColor: colors.white,
    width: '100%',
    height: '100%',
    top: '70%',
  },
  close: {
    alignSelf: 'flex-end',
    marginVertical: 10,
  },
  text: {
    color: colors.bleuFbi,
  },
  textContainer: {
    alignItems: 'center',
  },
});
