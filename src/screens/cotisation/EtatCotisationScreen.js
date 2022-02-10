import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useCallback, useContext, useState, useEffect } from 'react';
import AddNewButton from '../../components/common/AddNewButton';
import routes from '../../navigation/routes';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import useSelectedAssociation from '../../hooks/useSelectedAssociation';
import MemberItem from '../../components/member/MemberItem';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import AppWaitInfo from '../../components/common/AppWaitInfo';
import useAuth from '../../hooks/useAuth';
import useCotisation from '../../hooks/useCotisation';
import { colors } from '../../utils/styles';

export default function EtatCotisationScreen({ navigation }) {
  const { isAdmin, isModerator } = useAuth();
  const { selectedAssoState } = useContext(SelectedAssociationContext);
  const { isMemberUpToCotisationDate, notPayedCompter } = useCotisation();
  const { getSelectedAssoMembersCotisations, getMemberCotisationsInfo } = useSelectedAssociation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getMembersCotisations = useCallback(async () => {
    setLoading(true);
    const errorState = await getSelectedAssoMembersCotisations(
      selectedAssoState.selectedAssociation.id
    );
    if (errorState) setError(errorState);
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log('not payed ', notPayedCompter());
    getMembersCotisations();
  }, []);

  return (
    <>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={selectedAssoState.associationMembers}
        keyExtractor={(item) => item.id + 'cotisation'}
        renderItem={({ item }) => (
          <MemberItem
            moreInfoStyle={{
              color: isMemberUpToCotisationDate(item.member.id) ? colors.vert : colors.rougeBordeau,
            }}
            showTotal={true}
            total={getMemberCotisationsInfo(item.member.id)?.nombreCotisations}
            montant={getMemberCotisationsInfo(item.member.id)?.totalCotisationsMontant}
            moreInfo={isMemberUpToCotisationDate(item.member.id) ? 'à jour' : 'en retard'}
            member={item}
            avatar={item.avatar}
          />
        )}
      />
      <AddNewButton
        notif={notPayedCompter()}
        icon="view-list"
        onPress={() => navigation.navigate(routes.LIST_COTISATION)}
      />
      {!loading && !error && selectedAssoState.associationMembers.length === 0 && (
        <AppWaitInfo info="Chargement de la liste..." />
      )}
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingVertical: 20,
  },
});
