import { StyleSheet, FlatList } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import AddNewButton from '../../components/common/AddNewButton';
import routes from '../../navigation/routes';
import useSelectedAssociation from '../../hooks/useSelectedAssociation';
import MemberItem from '../../components/member/MemberItem';
import useEngagement from '../../hooks/useEngagement';
import { getAllEngagementsVotes } from '../../api/services/engagementServices';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import { selectedAssoActions } from '../../reducers/selectedAssociationReducer';

export default function EtatEngagementScreen({ navigation }) {
  const { selectedAssoState, dispatchSelectedAsso } = useContext(SelectedAssociationContext);
  const { getSelectedAssoCurrentMembers } = useSelectedAssociation();
  const { getSelectedMemberEngagements, getNotVoteCounter } = useEngagement();
  const [loading, setLoading] = useState(false);

  const getAllEngageMembersVotes = useCallback(async () => {
    setLoading(true);
    const response = await getAllEngagementsVotes({
      associationId: selectedAssoState.selectedAssociation.id,
    });
    if (!response.ok) {
      setLoading(false);
      alert('Erreur: Impossible de recuper les votes.');
      return;
    }
    dispatchSelectedAsso({
      type: selectedAssoActions.all_engagements_votes,
      allVotes: response.data,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    getAllEngageMembersVotes();
  }, []);
  return (
    <>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={getSelectedAssoCurrentMembers().actifMembers}
        keyExtractor={(item) => item.id.toString() + 'engagement'}
        renderItem={({ item }) => (
          <MemberItem
            showTotal={true}
            montant={getSelectedMemberEngagements(item.member.id).totalAmount}
            total={getSelectedMemberEngagements(item.member.id).totalEngagements}
            onPress={() => navigation.navigate(routes.MEMBER_ENGAGEMENT, item)}
            member={item}
          />
        )}
      />
      {loading && <AppActivityIndicator />}
      <AddNewButton
        notif={getNotVoteCounter()}
        icon="vote"
        onPress={() => navigation.navigate(routes.VOTE_ENGAGEMENT)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingVertical: 20,
  },
});
