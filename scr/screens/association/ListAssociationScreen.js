import { FlatList } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import AddNewButton from '../../components/common/AddNewButton';
import routes from '../../navigation/routes';
import { AssociationContext } from '../../contexts/AssociationContext';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import AppWaitInfo from '../../components/common/AppWaitInfo';
import AssociationCard from '../../components/association/AssociationCard';
import { MemberContext } from '../../contexts/MemberContext';
import useMember from '../../hooks/useMember';

export default function ListAssociationScreen({ navigation }) {
  const { associationState } = useContext(AssociationContext);
  const { memberState } = useContext(MemberContext);
  const { getAssociationMemberState } = useMember();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [associations, setAssociations] = useState([]);

  const handleSelectAssociation = (association) => {
    navigation.navigate(routes.ASSOCIATION_DETAIL, association);
  };

  useEffect(() => {
    setAssociations(associationState.list);
  }, [associationState.list, memberState.userAssociations]);

  return (
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={associations}
        keyExtractor={(assoc) => assoc.nom}
        renderItem={({ item }) => (
          <AssociationCard
            adhesionState={getAssociationMemberState(memberState.userAssociations, item.id)}
            association={item}
            onPress={() => handleSelectAssociation(item)}
          />
        )}
      />
      {associations.length === 0 && !error && (
        <AppWaitInfo info="Chargement de la liste encours..." />
      )}
      {!loading && error && <AppWaitInfo info={`Erreur: ${error}`} />}

      <AddNewButton onPress={() => navigation.navigate(routes.NEW_ASSOCIATION)} />
      {loading && <AppActivityIndicator />}
    </>
  );
}
