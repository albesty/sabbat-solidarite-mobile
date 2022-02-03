import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
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

export default function StarterScreen({ navigation }) {
  const { state } = useContext(AuthContext);
  const { memberState } = useContext(MemberContext);
  const { getLogout, isAdmin } = useAuth();
  const { getAssociationMemberState } = useMember();
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

  useEffect(() => {
    if (isAdmin()) {
      setUserAssociations(associationState.list);
    } else {
      setUserAssociations(memberState.userAssociations);
    }
  }, [associationState.list, memberState.userAssociations]);

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
          labelStyle={styles.titleStyle}
          style={styles.links}
          title="Transactions"
          mode="outlined"
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {userAssociations.map((item) => (
          <AssociationCard
            key={item.nom}
            association={item}
            adhesionState={getAssociationMemberState(userAssociations, item.id)}
          />
        ))}
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
});
