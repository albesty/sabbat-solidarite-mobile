import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useContext } from 'react';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import AppSurface from '../../components/common/AppSurface';
import MemberItem from '../../components/member/MemberItem';
import { colors } from '../../utils/styles';

export default function ListMemberScreen() {
  const { selectedAssoState } = useContext(SelectedAssociationContext);

  const handleGetItemDetail = (member) => {
    console.log('selected member............', member);
  };

  return (
    <>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={selectedAssoState.associationMembers}
        keyExtractor={(item) => item.id + 'member'}
        renderItem={({ item }) => (
          <MemberItem
            moreInfoStyle={{
              color:
                item.member.relation.toLowerCase() === 'member' ? colors.vert : colors.rougeBordeau,
            }}
            member={item}
            moreInfo={item.member.relation.toLowerCase() === 'member' ? 'actif' : 'parti'}
          />
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingVertical: 20,
  },
});
