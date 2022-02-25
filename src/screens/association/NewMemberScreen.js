import React, { useContext } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import MemberItem from '../../components/member/MemberItem';
import routes from '../../navigation/routes';
import useSelectedAssociation from '../../hooks/useSelectedAssociation';
import AppMessage from '../../components/common/AppMessage';

export default function NewMemberScreen({ navigation }) {
  const { selectedAssoState } = useContext(SelectedAssociationContext);
  const { getSelectedAssoCurrentMembers } = useSelectedAssociation();

  return (
    <>
      {getSelectedAssoCurrentMembers().inactifMembers.length > 0 && (
        <FlatList
          contentContainerStyle={styles.container}
          data={getSelectedAssoCurrentMembers().inactifMembers}
          keyExtractor={(item) => item.id.toString() + 'new'}
          renderItem={({ item }) => (
            <MemberItem
              onPress={() =>
                navigation.navigate(routes.MEMBER, { screen: routes.MEMBER_DETAIL, params: item })
              }
              member={item}
            />
          )}
        />
      )}
      {getSelectedAssoCurrentMembers().inactifMembers.length === 0 && (
        <AppMessage message="Aucun nouveau membre trouvé." />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    marginHorizontal: 10,
  },
});
