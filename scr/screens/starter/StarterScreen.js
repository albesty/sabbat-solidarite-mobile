import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import routes from '../../navigation/routes';
import useAssociation from '../../hooks/useAssociation';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import AppWaitInfo from '../../components/common/AppWaitInfo';
import { AssociationContext } from '../../contexts/AssociationContext';
import useMember from '../../hooks/useMember';
import useAuth from '../../hooks/useAuth';
import AppButton from '../../components/common/AppButton';
import AssociationCard from '../../components/association/AssociationCard';
import { MemberContext } from '../../contexts/MemberContext';
import AppText from '../../components/common/AppText';
import AppSpacer from '../../components/common/AppSpacer';
import AppSeparator from '../../components/common/AppSeparator';

export default function StarterScreen({ navigation }) {
  const { memberState } = useContext(MemberContext);
  const { getLogout, isAdmin } = useAuth();
  const { associationState } = useContext(AssociationContext);
  const [userAssociations, setUserAssociations] = useState([]);
  const { getAssociationsList } = useAssociation();
  const { getUserAssociations } = useMember();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
            navigation.navigate(routes.TRANSACTION, { screen: routes.TRANSACTION_HOME })
          }
          labelStyle={styles.titleStyle}
          style={styles.links}
          title="Transactions"
          mode="outlined"
        />
      </View>
      <AppSeparator />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {userAssociations.map((item) => (
          <AssociationCard
            handleValidPress={() => handleValidPress(item)}
            onPress={() => handleValidPress(item)}
            key={item.nom}
            association={item}
            adhesionState={memberState.userAssociations
              .find((ass) => ass.id === item.id)
              ?.member?.relation.toLowerCase()}
          />
        ))}
        {!error && userAssociations.length === 0 && (
          <View style={styles.info}>
            <AppText style={{ fontWeight: 'bold' }}>
              Sabbat-solidarité est une solution d'épargne en association.
            </AppText>
            <AppSpacer />
            <AppText>Nous visons deux (2) objectifs principaux:</AppText>
            <AppSpacer />
            <View>
              <AppText>
                1 - Permettre la mise en place facile et sécurisée d'une caisse en association.
              </AppText>
              <AppSpacer />
              <View>
                <AppText>
                  2 - Garantir le financement de projets de chaque association à travers notre
                  concept de fonds triplés.
                </AppText>
                <AppText>
                  Le concept de fonds triplés est l'octroie de crédit de financement dont le montant
                  est égal au triple de votre épargne.
                </AppText>
                <AppSpacer />
                <AppText>Pour en bénéficier, c'est très simple:</AppText>
                <AppSpacer />
                <AppText>- Votre association doit comprendre au moins 5 membres actifs.</AppText>
                <AppText>
                  - Votre association doit avoir fait au moins un (1) an de cotisation regulière.
                </AppText>
              </View>
            </View>
            <AppSpacer />
            <AppSpacer />
            <AppButton
              onPress={() => navigation.navigate(routes.LIST_ASSOCIATION)}
              title="Adherer ou créer une association."
            />
          </View>
        )}
      </ScrollView>

      {!loading && error && <AppWaitInfo info="Erreur: Echec du chargement de la liste." />}
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  titleStyle: {
    fontSize: 10,
    paddingVertical: 5,
  },
  links: {
    width: '40%',
    minWidth: '30%',
  },
  info: {
    marginHorizontal: 10,
    paddingVertical: 10,
  },
});
