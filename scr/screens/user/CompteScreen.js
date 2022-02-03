import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppImagePicker from '../../components/common/AppImagePicker';
import UserAvatar from '../../components/user/UserAvatar';
import AppText from '../../components/common/AppText';
import { AuthContext } from '../../contexts/AuthContext';
import AppIconButton from '../../components/common/AppIconButton';
import { colors } from '../../utils/styles';
import UploaderModal from '../../components/common/UploaderModal';
import useUploadImage from '../../hooks/useUploadImage';
import { editUserImage } from '../../api/services/authServices';
import { actions as authActions } from '../../reducers/authReducer';
import AppSurface from '../../components/common/AppSurface';
import AppAnimation from '../../components/common/AppAnimation';
import AppSpacer from '../../components/common/AppSpacer';
import useAssociation from '../../hooks/useAssociation';
import AppButton from '../../components/common/AppButton';
import { List } from 'react-native-paper';
import routes from '../../navigation/routes';

export default function CompteScreen({ route, navigation }) {
  const { state, dispatch } = useContext(AuthContext);
  const { formatFonds } = useAssociation();
  const { uploader } = useUploadImage();
  const selectedUser = route.params ? route.params : state.user;
  const [currentUser, setCurrentUser] = useState(selectedUser);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [uploadAvatarProgress, setUploadAvatarProgress] = useState(0);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [pieces, setPieces] = useState([]);
  const [validePieces, setValidePieces] = useState(false);
  const [uploadingPiece, setUploadingPiece] = useState(false);
  const [uploadPieceProgress, setUploadPieceProgress] = useState(0);
  const [isPiece, setIsPiece] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const handleSelectPieces = (image) => {
    setImageModalVisible(false);
    setPieces([...pieces, image]);
    setValidePieces(true);
  };

  const handleSaveImages = async (imge) => {
    setImageModalVisible(false);
    if (isPiece) {
      setUploadPieceProgress(0);
      setUploadingPiece(true);
    } else {
      setUploadAvatarProgress(0);
      setUploadingAvatar(true);
    }
    try {
      const result = await uploader([imge], (progress) => setUploadAvatarProgress(progress / 1));
      const urls = result.signedUrlsArray.map((res) => res.url);
      let data = {};
      if (isPiece) {
        data = {
          pieces: urls,
          userId: currentUser.id,
        };
      } else {
        data = {
          avatarUrl: urls[0],
          userId: currentUser.id,
        };
      }
      const editResponse = await editUserImage(data);
      if (!editResponse.ok) {
        setUploadingPiece(false);
        setUploadingAvatar(false);
        alert("Erreur lors de l'enregistrement de l'image.");
        return;
      }
      setUploadingPiece(false);
      setUploadingAvatar(false);
      setCurrentUser(editResponse.data);
      dispatch({ type: authActions.update_avatar, updatedUser: editResponse.data });
      alert('Votre avatar a été modifié avec succès.');
    } catch (error) {
      setUploadingPiece(false);
      setUploadingAvatar(false);
      alert("Erreur lors de l'enregistrement de l'image.");
      throw new Error(error);
    }
  };
  const handleSavePieces = async () => {
    if (pieces.length < 2) {
      Alert.alert(
        'Information',
        "Si votre document comporte 2 faces, vous devez ajouter l'autre face avant de valider.",
        [
          {
            text: 'Ajouter',
            onPress: () => {
              setImageModalVisible(true);
            },
          },
          { text: 'Valider quand meme', onPress: async () => await handleSaveImages(pieces) },
        ]
      );
    } else {
      await handleSaveImages(pieces);
    }
  };

  const handleSaveAvatar = async (image) => {
    await handleSaveImages(image);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.contentStyle}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarLoadingContainer}>
            <UserAvatar
              loadingContainer={styles.avatarLoading}
              avatar={currentUser.avatar}
              avatarStyle={styles.avatar}
            />
            {uploadingAvatar && (
              <UploaderModal style={styles.avatarLoading} progress={uploadAvatarProgress} />
            )}
          </View>
          <AppText style={{ marginVertical: 10 }}>
            {selectedUser.username ? selectedUser.username : selectedUser.email}
          </AppText>
          {!uploadingAvatar && (
            <AppIconButton
              onPress={() => setImageModalVisible(true)}
              size={35}
              icon="camera"
              style={styles.camera}
            />
          )}
        </View>
        <AppSpacer />
        <AppSpacer />
        <AppSurface style={styles.wallet}>
          <View style={{ alignSelf: 'flex-start' }}>
            <AppAnimation
              size={100}
              source={require('../../../assets/animations/wallet-animation.json')}
            />
          </View>
          <AppSpacer />
          <AppText>{formatFonds(currentUser.wallet)}</AppText>
          <AppSpacer />
          <AppSpacer />
          <AppButton
            onPress={() => navigation.navigate(routes.TRANSACTION, { screen: routes.RECHARGE })}
            icon="credit-card-plus"
            mode="outlined"
            title="Recharger"
            style={styles.rechargeButton}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate(routes.TRANSACTION, { screen: routes.RETRAIT })}
            style={styles.retirerButton}
          >
            <MaterialCommunityIcons
              size={20}
              name="credit-card-minus"
              color={currentUser.wallet > 100 ? colors.vert : colors.rougeBordeau}
            />
            <AppText
              style={{
                color: currentUser.wallet > 100 ? colors.vert : colors.rougeBordeau,
                marginLeft: 5,
              }}
            >
              Retirer
            </AppText>
          </TouchableOpacity>
        </AppSurface>
        <AppSpacer />
        <List.Accordion
          title="Identification"
          left={(props) => <List.Icon {...props} icon="identifier" />}
        >
          <View style={styles.pieceContainer}>
            {pieces.length === 0 && (
              <AppText style={{ fontSize: 15 }}>
                Vos documents d'Identification s'afficheront ici. Les pièces d'Identification ne
                sont obligatoires que pour les utilisateurs désirant bénéfier de la formule fonds
                triplés.
              </AppText>
            )}
            {validePieces && (
              <AppButton onPress={() => handleSavePieces} icon="check" title="Valider" />
            )}
            <AppIconButton
              onPress={() => {
                setIsPiece(true);
                setImageModalVisible(true);
              }}
              size={35}
              icon="camera"
              style={[styles.camera, styles.pieceCamera]}
            />
          </View>
        </List.Accordion>
        <List.Accordion
          left={(props) => <List.Icon {...props} icon="wallet-outline" />}
          title="Transactions"
        >
          <List.Item
            title="Rechargements"
            onPress={() => navigation.navigate(routes.TRANSACTION, { screen: routes.RECHARGE })}
            left={(props) => <List.Icon {...props} icon="credit-card-plus" />}
          />
          <List.Item
            onPress={() => navigation.navigate(routes.TRANSACTION, { screen: routes.RETRAIT })}
            left={(props) => <List.Icon {...props} icon="credit-card-minus" />}
            title="Retraits"
          />
        </List.Accordion>
        <List.Accordion
          left={(props) => <List.Icon {...props} icon="account-details" />}
          title="Infos personnelles"
        >
          <List.Item
            onPress={() => navigation.navigate(routes.PROFILE)}
            left={(props) => <List.Icon {...props} icon="account-edit" />}
            title="Votre profile"
          />
        </List.Accordion>

        <List.Accordion
          left={(props) => <List.Icon {...props} icon="cog" />}
          title="Parametres de connexion"
        >
          <List.Item
            onPress={() => navigation.navigate(routes.PARAM)}
            left={(props) => <List.Icon {...props} icon="account-settings" />}
            title="Modifier"
          />
        </List.Accordion>
      </ScrollView>

      <AppImagePicker
        onSelectImage={(imageData) => {
          if (isPiece) handleSelectPieces(imageData);
          else handleSaveAvatar(imageData);
        }}
        onCloseImageModal={() => setImageModalVisible(false)}
        imageModalVisible={imageModalVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  avatar: {
    height: 160,
    width: 160,
    borderRadius: 80,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginTop: 10,
  },
  camera: {
    backgroundColor: colors.leger,
    position: 'absolute',
    bottom: 40,
    right: -30,
  },
  contentStyle: {
    paddingBottom: 50,
  },
  avatarLoading: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  avatarLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wallet: {
    marginHorizontal: 20,
  },
  rechargeButton: {
    marginVertical: 10,
    width: '80%',
  },
  retirerButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieceCamera: {
    top: 5,
    left: 5,
  },
  pieceContainer: {
    height: 180,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoPiece: {
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'flex-start',
  },
});
