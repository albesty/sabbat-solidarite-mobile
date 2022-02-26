import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import AppText from '../common/AppText';
import { colors } from '../../utils/styles';
import useAuth from '../../hooks/useAuth';
import { AuthContext } from '../../contexts/AuthContext';
import AppButton from '../common/AppButton';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import AppIconButton from '../common/AppIconButton';
import AppSpacer from '../common/AppSpacer';
import AppImagePicker from '../common/AppImagePicker';
import useUploadImage from '../../hooks/useUploadImage';
import UploaderModal from '../common/UploaderModal';
import { updateAvatar } from '../../api/services/associationServices';
import { AssociationContext } from '../../contexts/AssociationContext';
import { associationsActions } from '../../reducers/associationReducer';
import useAssociation from '../../hooks/useAssociation';
import AppAnimation from '../common/AppAnimation';
export default function AssociationCard({
  coverStyle,
  cardStyle,
  association,
  adhesionState,
  handleValidPress,
  showActions = true,
  showCamera,
}) {
  const { state } = useContext(AuthContext);
  const { associationDispatch } = useContext(AssociationContext);
  const { isAdmin, isModerator } = useAuth();
  const { sendAdhesionMessageToAssociation } = useAssociation();
  const { uploader } = useUploadImage();
  const [cardLoading, setCardLoading] = useState(false);
  const [disableSendButton, setDisableSendButton] = useState(false);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [assoImage, setAssoImage] = useState(association.avatar);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [disableCancel, setDisableCancel] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAuthorized = isAdmin() || isModerator();
  const sendMessageForAdhesion = async () => {
    setCardLoading(true);
    setDisableSendButton(true);
    setError(null);
    const data = {
      userId: state.user.id,
      associationId: association.id,
    };
    const errorState = await sendAdhesionMessageToAssociation(data);
    if (errorState) {
      setCardLoading(false);
      setDisableSendButton(false);
      setError(response.data?.message);
      return;
    }
    setCardLoading(false);
    setDisableSendButton(false);
  };

  const cancelAdhesion = () => {
    Alert.alert(
      'Attention!',
      `Souhaitez-vous annuler votre demande d'adhésion à ${association.nom}?`,
      [
        {
          text: 'Non',
          onPress: () => {
            return;
          },
        },
        {
          text: 'Oui',
          onPress: async () => {
            setCancelLoading(true);
            setDisableCancel(true);
            setError(null);
            const data = {
              relation: 'rejected',
              userId: state.user.id,
              associationId: association.id,
            };
            const errorState = await sendAdhesionMessageToAssociation(data);
            if (errorState) {
              setCancelLoading(false);
              setDisableCancel(false);
              setError(response.data?.message);
              return;
            }
            setCancelLoading(false);
            setDisableCancel(false);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleChangeBackImage = async (imageData) => {
    setShowImageModal(false);
    setAssoImage(imageData.url);
    setUploading(true);
    setProgress(0);
    const result = await uploader([imageData], (progress) => {
      setProgress(progress);
    });
    const updateResponse = await updateAvatar({
      associationId: association.id,
      avatarUrl: result.signedUrlsArray[0].url,
    });
    if (!updateResponse.ok) {
      setUploading(false);
      alert('Impossible de mettre vos images à jour.');
      setAssoImage(association.avatar);
      return;
    }
    associationDispatch({
      type: associationsActions.update_info,
      association: updateResponse.data,
    });
    alert('Les images ont été mises à jour avec succès.');
    setUploading(false);
  };

  return (
    <>
      <Card
        onPress={association.isValid ? null : handleValidPress}
        elevation={5}
        mode="elevated"
        style={[styles.card, cardStyle]}
      >
        <TouchableWithoutFeedback onPress={handleValidPress}>
          <View>
            <Card.Cover
              onLoadEnd={() => setLoading(false)}
              onLoadStart={() => setLoading(true)}
              style={[{ height: 180 }, coverStyle]}
              source={
                assoImage ? { uri: assoImage } : require('../../../assets/main_dans_la_main.jpg')
              }
            />
            {loading && (
              <View style={styles.loading}>
                <AppAnimation />
              </View>
            )}
            {showCamera && isAuthorized && (
              <View style={styles.cameraContainer}>
                <AppIconButton
                  style={styles.camera}
                  onPress={() => setShowImageModal(true)}
                  icon="camera"
                />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>

        {uploading && <UploaderModal style={styles.avatarLoading} progress={progress} />}
        <Card.Content style={{ paddingBottom: showActions ? 0 : 10 }}>
          <Card.Title
            title={association.nom}
            subtitle={association.description}
            titleNumberOfLines={1}
            subtitleNumberOfLines={2}
            subtitleStyle={styles.subtitle}
          />
        </Card.Content>
        {showActions && (
          <Card.Actions style={styles.cardActions}>
            <AppSpacer />
            <AppSpacer />
            {adhesionState === 'member' ? (
              <View style={styles.contentContainer}>
                <AppIconButton color={colors.vert} icon="account-group" />
                <AppText style={styles.memberStyle}>membre</AppText>
              </View>
            ) : adhesionState === 'ondemand' ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <AppText style={styles.checking}>envoyé</AppText>
                <AppButton
                  onPress={cancelAdhesion}
                  icon="cancel"
                  style={styles.stopButton}
                  mode="outlined"
                  title="Annuler l'adhésion"
                  labelStyle={styles.exitButton}
                  disabled={disableCancel}
                  loading={cancelLoading}
                />
              </View>
            ) : adhesionState === 'onleave' ? (
              <AppButton
                icon="account-multiple-plus"
                labelStyle={styles.labelButton}
                disabled={disableSendButton}
                loading={cardLoading}
                style={[styles.adminStatyle, styles.button]}
                title="Réintégrer"
                onPress={sendMessageForAdhesion}
              />
            ) : (
              <AppButton
                icon="account-multiple-plus"
                labelStyle={styles.labelButton}
                disabled={disableSendButton}
                loading={cardLoading}
                style={[styles.adminStatyle, styles.button]}
                title="Adhérer"
                onPress={sendMessageForAdhesion}
              />
            )}
          </Card.Actions>
        )}
        {!association.isValid && (
          <View style={styles.validating}>
            <AppText>Encours de validation...</AppText>
          </View>
        )}
      </Card>

      <AppImagePicker
        onSelectImage={handleChangeBackImage}
        imageModalVisible={showImageModal}
        onCloseImageModal={() => setShowImageModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  avatarLoading: {
    width: '100%',
    height: '100%',
  },
  card: {
    margin: 10,
  },
  subtitle: {
    fontSize: 15,
  },
  adminStatyle: {
    width: '40%',
    minWidth: '30%',
  },
  button: {
    flex: 1,
    marginHorizontal: 30,
    marginVertical: 5,
  },
  camera: {
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    position: 'absolute',
    right: 10,
    bottom: 0,
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  labelButton: {
    paddingVertical: 5,
  },
  loading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.leger,
    opacity: 0.8,
    position: 'absolute',
    alignSelf: 'center',
  },
  memberStyle: {
    color: colors.vert,
  },
  checking: {
    color: colors.bleuFbi,
    marginRight: 40,
  },
  exitButton: {
    color: colors.rougeBordeau,
    paddingVertical: 5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopButton: {
    width: 'auto',
    backgroundColor: colors.white,
  },
  validating: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 999,
    backgroundColor: colors.white,
    opacity: 0.5,
  },
});
