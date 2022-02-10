import { FlatList, StyleSheet } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import AddNewButton from '../../components/common/AddNewButton';
import routes from '../../navigation/routes';
import { AssociationContext } from '../../contexts/AssociationContext';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import AppWaitInfo from '../../components/common/AppWaitInfo';
import AssociationCard from '../../components/association/AssociationCard';
import { MemberContext } from '../../contexts/MemberContext';
import useMember from '../../hooks/useMember';
import { AuthContext } from '../../contexts/AuthContext';
import useAuth from '../../hooks/useAuth';

export default function ListAssociationScreen({ navigation }) {
  const { associationState } = useContext(AssociationContext);
  const { state } = useContext(AuthContext);
  const { memberState } = useContext(MemberContext);
  const { getUserAssociations } = useMember();
  const { isAdmin } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [associations, setAssociations] = useState([]);

  const handleSelectAssociation = (association) => {
    navigation.navigate(routes.ASSOCIATION_DETAIL, association);
  };

  const handleValidPress = (association) => {
    if (!association.isValid && !isAdmin()) {
      alert('Cette association est encours de validation.');
      return;
    }
    navigation.navigate(routes.ASSOCIATION_DETAIL, association);
  };

  const getMemberAssociations = useCallback(async () => {
    setLoading(true);
    const errorMember = await getUserAssociations();
    if (errorMember) {
      setLoading(false);
      alert('Error lors du rechargement.');
      return;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getMemberAssociations();
    setAssociations(associationState.list);
  }, [state.updateState]);

  return (
    <>
      <FlatList
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        data={associations}
        keyExtractor={(assoc) => assoc.nom}
        renderItem={({ item }) => (
          <AssociationCard
            handleValidPress={() => handleValidPress(item)}
            adhesionState={memberState.userAssociations
              .find((ass) => ass.id === item.id)
              ?.member?.relation.toLowerCase()}
            association={item}
            onPress={() => handleSelectAssociation(item)}
          />
        )}
      />
      {!loading && associations.length === 0 && !error && (
        <AppWaitInfo info="Aucune association trouvée." />
      )}
      {!loading && error && <AppWaitInfo info={`Erreur: ${error}`} />}
      {loading && <AppActivityIndicator />}

      <AddNewButton onPress={() => navigation.navigate(routes.NEW_ASSOCIATION)} />
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 30,
  },
});
