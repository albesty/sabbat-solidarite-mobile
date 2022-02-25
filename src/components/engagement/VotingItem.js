import React, { useContext, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import AppSurface from '../common/AppSurface';
import AppText from '../common/AppText';
import AppIconButton from '../common/AppIconButton';
import { colors } from '../../utils/styles';
import useEngagement from '../../hooks/useEngagement';
import { SelectedAssociationContext } from '../../contexts/SelectedAssociationContext';
import { voteEngagement } from '../../api/services/engagementServices';
import AppActivityIndicator from '../../components/common/AppActivityIndicator';
import { selectedAssoActions } from '../../reducers/selectedAssociationReducer';

export default function VotingItem({ engagement, goToVotants }) {
  const { selectedAssoState, dispatchSelectedAsso } = useContext(SelectedAssociationContext);
  const { getVotorsNumber, getEngagementVotingCount } = useEngagement();
  const [loading, setLoading] = useState(false);

  const handleVote = async (value) => {
    setLoading(true);
    const data = {
      id: engagement.id,
      associationId: selectedAssoState.selectedAssociation.id,
      votorId: selectedAssoState.connectedMember.member.id,
      typeVote: value.type,
    };

    const response = await voteEngagement(data);
    if (!response.ok) {
      setLoading(false);
      alert('Erreur: Impossible de valider votre vote.');
      return;
    }
    dispatchSelectedAsso({
      type: selectedAssoActions.vote_engagement,
      votedEngagement: response.data,
    });
    setLoading(false);
    alert('Vous avez voté avec succès.');
    dispatchSelectedAsso({ type: selectedAssoActions.must_update, updated: true });
  };

  return (
    <>
      <AppSurface surfaceStyle={styles.surfaceStyle} info="Voting">
        <View style={styles.voteCompterContainer}>
          <View style={styles.voteCompter}>
            <TouchableOpacity onPress={goToVotants}>
              <AppText style={styles.compterText}>Votants:</AppText>
            </TouchableOpacity>
            <AppText>{getEngagementVotingCount(engagement.id).totalVotes}</AppText>
            <AppText> / </AppText>
            <AppText>{getVotorsNumber()}</AppText>
          </View>
          <View style={styles.thumbVoter}>
            <AppIconButton
              info={
                getEngagementVotingCount(engagement.id).upVotes > 0
                  ? getEngagementVotingCount(engagement.id).upVotes
                  : null
              }
              onPress={() => handleVote({ type: 'up' })}
              style={styles.voteUp}
              icon="thumb-up"
            />
            <View>
              <AppIconButton
                info={
                  getEngagementVotingCount(engagement.id).downVotes > 0
                    ? getEngagementVotingCount(engagement.id).downVotes
                    : null
                }
                infoStyle={styles.info}
                onPress={() => handleVote({ type: 'down' })}
                style={styles.voteDown}
                icon="thumb-down"
              />
            </View>
          </View>
        </View>
      </AppSurface>
      {loading && <AppActivityIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  info: {
    position: 'absolute',
    bottom: 5,
    left: -2,
  },
  surfaceStyle: {
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
  thumbVoter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteCompter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteCompterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voteDown: {
    backgroundColor: colors.rougeBordeau,
  },
  compterText: {
    marginRight: 10,
    color: colors.bleuFbi,
  },
  voteUp: {
    backgroundColor: colors.vert,
    marginRight: 20,
  },
});
