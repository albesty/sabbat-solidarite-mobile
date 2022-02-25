import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppImagePicker from '../../components/common/AppImagePicker';
import UserAvatar from '../../components/user/UserAvatar';
import AppText from '../../components/common/AppText';
import { AuthContext } from '../../contexts/AuthContext';
import AppIconButton from '../../components/common/AppIconButton';
import { colors } from '../../utils/styles';
import UploaderModal from '../../components/common/UploaderModal';
import useUploadImage from '../../hooks/useUploadImage';
import { editUserImage, getSelectedUserData } from '../../api/services/authServices';
import { actions, actions as authActions } from '../../reducers/authReducer';
import AppSurface from '../../components/common/AppSurface';
import AppAnimation from '../../components/common/AppAnimation';
import AppSpacer from '../../components/common/AppSpacer';
import useAssociation from '../../hooks/useAssociation';
import AppButton from '../../components/common/AppButton';
import routes from '../../navigation/routes';
import useAuth from '../../hooks/useAuth';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';

export default function CompteScreen({ route, navigation }) {
  const { state, dispatch } = useContext(AuthContext);
  const { isAdmin } = useAuth();
  const selectedUser = route.params;
  const { formatFonds, showLargeImage } = useAssociation();
  const { uploader } = useUploadImage();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(selectedUser || {});
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [uploadAvatarProgress, setUploadAvatarProgress] = useState(0);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [pieces, setPieces] = useState(currentUser.piece ? currentUser.piece : []);
  const [validePieces, setValidePieces] = useState(false);
  const [piecesLoading, setPiecesLoading] = useState(false);
  const [uploadingPiece, setUploadingPiece] = useState(false);
  const [uploadPieceProgress, setUploadPieceProgress] = useState(0);
  const [isPiece, setIsPiece] = useState(false);
  const [permutPiece, setPermutPiece] = useState(false);

  const showLoadingPieceContainer = uploadingPiece || piecesLoading;

  const getUserState = async () => {
    setLoading(true);
    const adminUser = state.selectedUser ? state.selectedUser : state.user;
    const user = isAdmin() ? adminUser : state.user;
    const data = {
      userId: user.id,
    };
    const selectedUserData = await getSelectedUserData(data);
    if (!selectedUserData.ok) {
      setLoading(false);
      alert("Erreur: nous n'avons pas pu mettre vos informations à jour.");
    }
    setCurrentUser(selectedUserData.data);
    setLoading(false);
    dispatch({ type: actions.select_user, user: null });
    dispatch({ type: actions.update_state, updateState: false });
  };

  useEffect(() => {
    if (state.updateState || state.selectedUser) {
      getUserState();
    }
  }, [state.updateState, state.selectedUser]);

  const handleSelectPieces = (image) => {
    setImageModalVisible(false);
    if (pieces.length === 2) setPieces([image]);
    else setPieces([...pieces, image]);
    setValidePieces(true);
  };

  const handleSaveImages = async (imge) => {
    const dataArray = isPiece ? pieces : [imge];
    setImageModalVisible(false);
    if (isPiece) {
      setUploadPieceProgress(0);
      setUploadingPiece(true);
    } else {
      setUploadAvatarProgress(0);
      setUploadingAvatar(true);
    }
    try {
      const result = await uploader(dataArray, (progress) => setUploadAvatarProgress(progress / 1));
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
      dispatch({ type: authActions.update_info, updatedUser: editResponse.data });
      setValidePieces(false);
      alert('Vos images ont été modifiées avec succès.');
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
              return setImageModalVisible(true);
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
    let newUser = { ...currentUser, avatar: image.url };
    setCurrentUser(newUser);
    await handleSaveImages(image);
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentStyle}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarLoadingContainer}>
            <UserAvatar
              onPress={() => showLargeImage(currentUser.avatar)}
              user={currentUser}
              loadingContainer={styles.avatarLoading}
              avatarStyle={styles.avatar}
            />
            {uploadingAvatar && (
              <UploaderModal style={styles.avatarLoading} progress={uploadAvatarProgress} />
            )}
            {!uploadingAvatar && (
              <AppIconButton
                showInfo={false}
                onPress={() => setImageModalVisible(true)}
                size={35}
                icon="camera"
                style={styles.camera}
              />
            )}
          </View>
          <AppText style={{ marginVertical: 10 }}>
            {currentUser.username ? currentUser.username : currentUser.email}
          </AppText>
        </View>
        <AppSpacer />
        <AppSpacer />
        <AppSurface style={styles.wallet}>
          <View style={{ alignSelf: 'flex-start' }}>
            <AppAnimation size={100} source={require('../../../assets/wallet-animation.json')} />
          </View>
          <AppSpacer />
          <AppText style={styles.walletFunds}>{formatFonds(currentUser.wallet)}</AppText>
          <AppSpacer />
          <AppSpacer />
          <AppButton
            labelStyle={styles.rechargeLabel}
            onPress={() =>
              navigation.navigate(routes.TRANSACTION, {
                screen: routes.NEW_TRANSACTION,
                params: { transactionName: 'rechargement', user: currentUser },
              })
            }
            icon="credit-card-plus"
            mode="outlined"
            title="Recharger"
            style={styles.rechargeButton}
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(routes.TRANSACTION, {
                screen: routes.NEW_TRANSACTION,
                params: { transactionName: 'retrait', user: currentUser },
              })
            }
            style={styles.retirerButton}
          >
            <MaterialCommunityIcons
              size={20}
              name="credit-card-minus"
              color={currentUser.wallet > 100 ? colors.bleuFbi : colors.rougeBordeau}
            />
            <AppText
              style={{
                color: currentUser.wallet > 100 ? colors.bleuFbi : colors.rougeBordeau,
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
          <View>
            <View style={styles.pieceContainer}>
              {pieces.length === 0 && (
                <AppText style={{ fontSize: 15 }}>
                  Vos documents d'Identification s'afficheront ici.
                </AppText>
              )}
              {pieces.length > 0 && (
                <Image
                  onLoadStart={() => setPiecesLoading(true)}
                  onLoadEnd={() => setPiecesLoading(false)}
                  style={styles.pieces}
                  source={{
                    uri:
                      isPiece && permutPiece
                        ? pieces[1].url
                        : isPiece && !permutPiece
                        ? pieces[0].url
                        : !isPiece && !permutPiece
                        ? pieces[0]
                        : pieces[1],
                  }}
                />
              )}

              {validePieces && !showLoadingPieceContainer && (
                <View style={styles.valideStyle}>
                  <AppIconButton
                    onPress={() => {
                      setPieces(currentUser.pieces || []);
                      setValidePieces(false);
                    }}
                    style={{ backgroundColor: colors.rougeBordeau }}
                    icon="cancel"
                  />
                  <AppIconButton
                    onPress={handleSavePieces}
                    style={{ backgroundColor: colors.vert, marginLeft: 50 }}
                    icon="check"
                  />
                </View>
              )}
              {showLoadingPieceContainer && (
                <View style={styles.piecesLoadingContainer}>
                  {piecesLoading && <AppAnimation />}
                  {uploadingPiece && <UploaderModal progress={uploadPieceProgress} />}
                </View>
              )}
            </View>
            <View style={styles.pieceButtons}>
              {pieces.length > 0 && !showLoadingPieceContainer && (
                <TouchableOpacity
                  onPress={() => setPermutPiece(!permutPiece)}
                  style={styles.pieceCamera}
                >
                  <MaterialCommunityIcons
                    style={styles.pieceInterneCamera}
                    name="update"
                    size={30}
                    color={colors.white}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => {
                  setIsPiece(true);
                  setImageModalVisible(true);
                }}
                style={styles.pieceCamera}
              >
                <MaterialCommunityIcons
                  style={styles.pieceInterneCamera}
                  name="camera"
                  size={30}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
          </View>
        </List.Accordion>
        <List.Item
          title="Transactions"
          onPress={() =>
            navigation.navigate(routes.TRANSACTION, {
              screen: routes.TRANSACTION_HOME,
              params: selectedUser,
            })
          }
          left={(props) => <List.Icon {...props} icon="wallet-outline" />}
        />

        <List.Item
          onPress={() => navigation.navigate(routes.PROFILE, selectedUser)}
          left={(props) => <List.Icon {...props} icon="account-details" />}
          title="Profile"
        />
        <List.Item
          onPress={() => navigation.navigate(routes.PARAM, selectedUser)}
          left={(props) => <List.Icon {...props} icon="cog" />}
          title="Paramètres de connexion"
        />
        <List.Item
          onPress={() => navigation.navigate(routes.CONTACT)}
          left={(props) => <List.Icon {...props} icon="help-circle" />}
          title="Besoin d'aide?"
        />
        {isAdmin() && (
          <List.Item
            onPress={() => navigation.navigate(routes.USER_ADMIN)}
            left={(props) => <List.Icon {...props} icon="account-settings" />}
            title="Admin user panel"
          />
        )}
      </ScrollView>

      <AppImagePicker
        onSelectImage={(imageData) => {
          if (isPiece) handleSelectPieces(imageData);
          else handleSaveAvatar(imageData);
        }}
        onCloseImageModal={() => setImageModalVisible(false)}
        imageModalVisible={imageModalVisible}
      />
      {loading && <AppActivityIndicator />}
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
    alignItems: 'center',
  },
  camera: {
    backgroundColor: colors.leger,
    position: 'absolute',
    bottom: 0,
    right: -40,
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
  walletFunds: {
    fontWeight: 'bold',
  },
  rechargeButton: {
    marginVertical: 10,
    width: '80%',
    backgroundColor: colors.white,
  },
  retirerButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieceButtons: {
    left: 5,
    top: 10,
    position: 'absolute',
  },
  pieceCamera: {
    backgroundColor: colors.leger,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    borderRadius: 25,
    marginVertical: 5,
  },
  pieceInterneCamera: {
    position: 'absolute',
  },
  pieceContainer: {
    height: 'auto',
    minHeight: 100,
    marginHorizontal: 20,
    alignItems: 'center',
    backgroundColor: colors.rougeBordeaus,
  },
  infoPiece: {
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'flex-start',
  },
  pieces: {
    height: 150,
    width: '100%',
  },

  rechargeLabel: {
    paddingVertical: 5,
    color: colors.vert,
  },
  retourneButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  valideStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.leger,
    marginVertical: 5,
  },
  piecesLoadingContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
});
