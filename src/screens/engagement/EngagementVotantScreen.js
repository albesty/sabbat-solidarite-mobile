import { StyleSheet, View, FlatList } from 'react-native';
import React, { useContext } from 'react';
import AppText from '../../components/common/AppText';
import { colors } from '../../utils/styles';
import useAssociation from '../../hooks/useAssociation';
import SmallMemberItem from '../../components/member/SmallMemberItem';
import useEngagement from '../../hooks/useEngagement';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import AppSeparator from '../../components/common/AppSeparator';
import AppIconButton from '../../components/common/AppIconButton';

export default function EngagementVotantScreen({ route }) {
  const selectedEngagement = route.params;
  const { selectedAssoState } = useContext(SelectedAssociationContext);
  const { formatFonds } = useAssociation();
  const { getEngagementCreator } = useEngagement();
  const creator = getEngagementCreator(selectedEngagement.Creator.id);

  return (
    <>
      <View style={styles.header}>
        <AppText>{selectedEngagement.libelle}</AppText>
        <AppText style={styles.fonds}>{formatFonds(selectedEngagement.montant)}</AppText>
      </View>
      <View style={styles.creator}>
        <AppText>par</AppText>
        <SmallMemberItem creator={creator} />
      </View>
      <AppText style={styles.votant}>Votants</AppText>
      <FlatList
        data={selectedAssoState.engagementsVotes[selectedEngagement.id]}
        keyExtractor={(item) => item.id.toString() + 'votant'}
        renderItem={({ item }) => (
          <SmallMemberItem
            style={styles.votantItem}
            creator={selectedAssoState.associationMembers.find((memb) => memb.id === item.userId)}
          >
            {item.vote.typeVote.toLowerCase() === 'up' ? (
              <AppIconButton color={colors.vert} icon="thumb-up" />
            ) : (
              <AppIconButton color={colors.rougeBordeau} icon="thumb-down" />
            )}
          </SmallMemberItem>
        )}
        ItemSeparatorComponent={AppSeparator}
      />
    </>
  );
}

const styles = StyleSheet.create({
  creator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  header: {
    backgroundColor: colors.leger,
    alignItems: 'center',
    paddingVertical: 20,
  },
  fonds: {
    fontWeight: 'bold',
  },
  votant: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  votantItem: {
    marginVertical: 20,
  },
});
