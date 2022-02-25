import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import MemberItem from '../../components/member/MemberItem';
import { colors } from '../../utils/styles';
import useSelectedAssociation from '../../hooks/useSelectedAssociation';
import routes from '../../navigation/routes';

export default function ListMemberScreen({ navigation }) {
  const { getSelectedAssoCurrentMembers } = useSelectedAssociation();

  return (
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        data={getSelectedAssoCurrentMembers().actifMembers}
        keyExtractor={(item) => item.id + 'member'}
        renderItem={({ item }) => (
          <MemberItem
            onPress={() => navigation.navigate(routes.MEMBER_DETAIL, item)}
            moreInfoStyle={{
              color:
                item.member.relation.toLowerCase() === 'member' ? colors.vert : colors.rougeBordeau,
            }}
            member={item}
            moreInfo={item.member.relation.toLowerCase() === 'member' ? 'actif' : 'veut quitter'}
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
