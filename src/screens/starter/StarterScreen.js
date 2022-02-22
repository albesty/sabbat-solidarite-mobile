import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import routes from '../../navigation/routes';
import useAssociation from '../../hooks/useAssociation';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import { AssociationContext } from '../../contexts/AssociationContext';
import useMember from '../../hooks/useMember';
import useAuth from '../../hooks/useAuth';
import AppButton from '../../components/common/AppButton';
import AssociationCard from '../../components/association/AssociationCard';
import { MemberContext } from '../../contexts/MemberContext';
import { selectedAssoActions } from '../../reducers/selectedAssociationReducer';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import { colors } from '../../utils/styles';
import useNotifications from '../../hooks/useNotifications';
import WelcomeModal from '../user/WelcomeModal';
import AppMessage from '../../components/common/AppMessage';
import { AuthContext } from '../../contexts/AuthContext';

export default function StarterScreen({ navigation }) {
  const { registerForPushNotificationsAsync } = useNotifications();

  const { memberState } = useContext(MemberContext);
  const { state } = useContext(AuthContext);
  const { getLogout, isAdmin } = useAuth();
  const { associationState } = useContext(AssociationContext);
  const { dispatchSelectedAsso } = useContext(SelectedAssociationContext);
  const [userAssociations, setUserAssociations] = useState([]);
  const { getAssociationsList } = useAssociation();
  const { getUserAssociations } = useMember();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [justComeIn, setJustComeIn] = useState(true);

  const getAssociations = useCallback(async () => {
    setError(null);
    setLoading(true);
    const errorState = await getAssociationsList();
    const userAssociationsError = await getUserAssociations();
    if (errorState || userAssociationsError) {
      const occuredErreur = errorState || userAssociationsError;
      setError(occuredErreur);
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(false);
  }, []);

  const handleValidPress = (association) => {
    if (!association.isValid && !isAdmin()) {
      alert('Cette association est encours de validation');
      return;
    }
    const checkAdhesion = memberState.userAssociations
      .find((ass) => ass.id === association.id)
      ?.member?.relation.toLowerCase();
    if (!isAdmin() && checkAdhesion.toLowerCase() !== 'member') {
      alert(
        "Vous n'êtes pas encore membre de cette association. Votre demande d'adhésion est encours d'analyze."
      );
      return;
    }
    dispatchSelectedAsso({ type: selectedAssoActions.select_one, selected: association });
    navigation.navigate(routes.ASSOCIATION_TAB, association);
  };

  useEffect(() => {
    if (isAdmin()) {
      setUserAssociations(associationState.list);
    } else {
      setUserAssociations(memberState.userAssociations);
    }
  }, [memberState.userAssociations, associationState.list]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', (e) => {
      setWelcomeVisible(false);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      Alert.alert('Alert!', 'Etes-vous sûr de vous deconnecter?', [
        {
          text: 'Non',
          onPress: () => {
            return;
          },
        },
        {
          text: 'Me deconnecter',
          onPress: () => {
            getLogout();
            const nextAction = e.data.action;
            if (nextAction) navigation.dispatch(e.data.action);
            else navigation.navigate(routes.WELCOME);
          },
        },
      ]);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    getAssociations();
    if (justComeIn) {
      setTimeout(() => {
        if (!error && userAssociations.length === 0) {
          setWelcomeVisible(true);
          setShowWelcomeModal(true);
        }
      }, 3000);

      registerForPushNotificationsAsync();
      setJustComeIn(false);
    }
  }, []);

  return (
    <>
      <View style={styles.linksContainer}>
        <AppButton
          onPress={() => navigation.navigate(routes.LIST_ASSOCIATION)}
          style={styles.links}
          labelStyle={styles.titleStyle}
          title="Associations"
          mode="outlined"
        />
        <AppButton
          onPress={() =>
            navigation.navigate(routes.TRANSACTION, {
              screen: routes.TRANSACTION_HOME,
              params: state.user,
            })
          }
          labelStyle={styles.titleStyle}
          style={styles.links}
          title="Transactions"
          mode="outlined"
        />
      </View>
      {!loading && !error && userAssociations.length > 0 && (
        <ScrollView
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
        >
          {userAssociations.map((item) => (
            <AssociationCard
              handleValidPress={() => handleValidPress(item)}
              key={item.nom}
              association={item}
              adhesionState={memberState.userAssociations
                .find((ass) => ass.id === item.id)
                ?.member?.relation.toLowerCase()}
            />
          ))}
        </ScrollView>
      )}
      {!loading && !error && userAssociations.length === 0 && !welcomeVisible && (
        <AppMessage
          onPress={() => {
            setWelcomeVisible(false);
            setShowWelcomeModal(false);
            navigation.navigate(routes.LIST_ASSOCIATION);
          }}
          message="Vous n'êtes pas encore membre d'association."
          buttonTile="Créer ou adhérer"
        />
      )}
      {!error && userAssociations.length === 0 && welcomeVisible && (
        <WelcomeModal
          visible={showWelcomeModal}
          onButtonPress={() => {
            setWelcomeVisible(false);
            setShowWelcomeModal(false);
            navigation.navigate(routes.LIST_ASSOCIATION);
          }}
          closeModal={() => {
            setWelcomeVisible(false);
            setShowWelcomeModal(false);
          }}
        />
      )}

      {!loading && error && <AppMessage message="Erreur: Echec du chargement de la liste." />}
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingVertical: 20,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: colors.rougeBordeau,
  },
  titleStyle: {
    paddingVertical: 10,
    color: colors.white,
  },
  links: {
    width: '40%',
    minWidth: '30%',
  },
});
