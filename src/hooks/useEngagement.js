import React, { useContext } from 'react';
import { SelectedAssociationContext } from '../contexts/SelectedAssociationContext';
import useSelectedAssociation from './useSelectedAssociation';

export default function useEngagement() {
  const { selectedAssoState } = useContext(SelectedAssociationContext);
  const { getSelectedAssoCurrentMembers } = useSelectedAssociation();

  const getSelectedAssoEngagementInfos = () => {
    const isValid = 'ended' || 'paying';
    const validEngagements = selectedAssoState.associationEngagements.filter(
      (engage) => engage.accord === true
    );
    const notValidEngagements = selectedAssoState.associationEngagements.filter(
      (engage) => !validEngagements.includes(engage)
    );
    return { validEngagements, notValidEngagements };
  };

  const getVotorsNumber = () => {
    let votorsNumber = 0;
    const validVotors = getSelectedAssoCurrentMembers().actifMembers.length;
    if (selectedAssoState.selectedAssociation.validationLenght) {
      votorsNumber = selectedAssoState.selectedAssociation.validationLenght;
    } else if (validVotors <= 10) {
      votorsNumber = validVotors;
    } else {
      votorsNumber = Math.ceil(validVotors / 2);
    }
    return votorsNumber;
  };

  const getEngagementVotingCount = (engagementId) => {
    let totalVotes = 0;
    let upVotes = 0;
    let downVotes = 0;
    const engageVotes = selectedAssoState.engagementsVotes[engagementId];
    if (engageVotes && engageVotes.length) {
      totalVotes = engageVotes.length;
      const allUpVotes = engageVotes.filter(
        (engageVote) => engageVote.vote.typeVote.toLowerCase() === 'up'
      );
      const allDownVotes = engageVotes.filter(
        (engageVote) => engageVote.vote.typeVote.toLowerCase() === 'down'
      );
      upVotes = allUpVotes.length;
      downVotes = allDownVotes.length;
    }
    return { totalVotes, upVotes, downVotes };
  };

  const getSelectedMemberEngagements = (memberId) => {
    let totalEngagements = 0;
    let totalAmount = 0;
    let memberEngagements = [];
    const allEngagements = selectedAssoState.associationEngagements;
    const memberValidEngagements = allEngagements.filter(
      (engage) => engage.creatorId === memberId && engage.accord === true
    );
    totalEngagements = memberValidEngagements.length;
    memberValidEngagements.forEach((element) => {
      totalAmount += element.montant;
    });
    memberEngagements = memberValidEngagements;
    return { memberEngagements, totalEngagements, totalAmount };
  };

  const getNotVoteCounter = () => {
    const allEngagements = selectedAssoState.associationEngagements;
    const engagementsVotes = selectedAssoState.engagementsVotes;
    let counter = 0;
    const allVoting = allEngagements.filter((engage) => engage.statut.toLowerCase() === 'voting');
    allVoting.forEach((engage) => {
      const selectedEngageVotes = engagementsVotes[engage.id];
      if (selectedEngageVotes) {
        const isVoted = selectedEngageVotes.some(
          (votor) => votor.userId === selectedAssoState.connectedMember.id
        );
        if (!isVoted) counter += 1;
      }
    });
    return counter;
  };

  const getEngagementCreator = (creatorId) => {
    const creator = selectedAssoState.associationMembers.find((user) => user.id === creatorId);
    return creator;
  };

  const getConnectedMemberVoteState = (engagementId) => {
    let voteState = '';
    const allVotes = selectedAssoState.engagementsVotes[engagementId];
    if (allVotes && allVotes.length > 0) {
      const isConnectedVoted = allVotes.find(
        (item) => item.userId === selectedAssoState.connectedMember.id
      );
      if (isConnectedVoted) {
        voteState = isConnectedVoted.vote.typeVote;
      }
    }
    return voteState;
  };
  return {
    getSelectedAssoEngagementInfos,
    getVotorsNumber,
    getEngagementVotingCount,
    getSelectedMemberEngagements,
    getNotVoteCounter,
    getEngagementCreator,
    getConnectedMemberVoteState,
  };
}
