import { useContext, useState } from 'react';
import { getSelectedAssociationEngagements } from '../api/services/engagementServices';
import {
  getAllCotisations,
  getAssoMembers,
  getAssoMembersCotisations,
} from '../api/services/selectedAssociationServices';
import { AuthContext } from '../contexts/AuthContext';
import { SelectedAssociationContext } from '../contexts/SelectedAssociationContext';
import { selectedAssoActions } from '../reducers/selectedAssociationReducer';

export default function useSelectedAssociation() {
  const { state } = useContext(AuthContext);
  const { selectedAssoState, dispatchSelectedAsso } = useContext(SelectedAssociationContext);

  const getselectedAssoMembers = async (selectedAssoId) => {
    const response = await getAssoMembers({ associationId: selectedAssoId });
    if (!response.ok) {
      alert('Impossibles de charger les membres de cette association');
      return;
    }
    dispatchSelectedAsso({
      type: selectedAssoActions.asso_members,
      members: response.data,
      connectedUserId: state.user.id,
    });
  };

  const getSelectedAssoMembersCotisations = async (associationId) => {
    let errorState = null;
    const response = await getAssoMembersCotisations({ associationId: associationId });
    if (!response.ok) {
      errorState = response.data;
      alert('Impossible de charger les cotisations');
      return;
    }
    dispatchSelectedAsso({
      type: selectedAssoActions.asso_cotisations,
      cotisations: response.data,
    });
    return errorState;
  };

  const getSelectedAssoAllCotisations = async (selectedId) => {
    const response = await getAllCotisations({ associationId: selectedId });
    if (!response.ok) {
      alert('Impossible de charger les cotisations.');
      return;
    }
    dispatchSelectedAsso({ type: selectedAssoActions.all_cotisations, cotisations: response.data });
  };

  const getMemberCotisationsInfo = (memberId) => {
    let nombreCotisations = 0;
    let totalCotisationsMontant = 0;
    let whiteFunds = 0;
    const allCotisations = selectedAssoState.associationCotisations;
    const memberCotisations = allCotisations[memberId];
    if (memberCotisations && memberCotisations.length > 0) {
      nombreCotisations = memberCotisations.length;
      memberCotisations.forEach((cotis) => {
        totalCotisationsMontant += cotis.montant;
        if (cotis.typeCotisation.toLowerCase() === 'mensuel') {
          whiteFunds += cotis.montant;
        }
      });
    }
    return { memberCotisations, nombreCotisations, totalCotisationsMontant, whiteFunds };
  };

  const getSelectedMembersAllCotisations = () => {
    let allMembersTotalCotisations = 0;
    let allMembersMontantCotisations = 0;
    const allMembers = selectedAssoState.associationMembers;
    allMembers.forEach((member) => {
      const memberTotalCotis = getMemberCotisationsInfo(member.member.id).nombreCotisations;
      const memberMontantCotisations = getMemberCotisationsInfo(
        member.member.id
      ).totalCotisationsMontant;
      allMembersTotalCotisations += memberTotalCotis;
      allMembersMontantCotisations += memberMontantCotisations;
    });
    return { allMembersMontantCotisations, allMembersTotalCotisations };
  };

  const getSelectedAssoMembersEngagements = async (associationId) => {
    let errorState = null;
    const response = await getSelectedAssociationEngagements({ associationId: associationId });
    if (!response.ok) {
      errorState = response.data;
      alert('Erreur: impossible de charger les engagements des membres.');
    }
    dispatchSelectedAsso({ type: selectedAssoActions.all_engagements, engagements: response.data });
    return errorState;
  };
  const getSelectedAssoCurrentMembers = () => {
    const allMembers = selectedAssoState.associationMembers;
    let actifMembers = [];
    let inactifMembers = [];
    const actifMembersTab = allMembers.filter(
      (memb) => memb.member?.relation.toLowerCase() !== 'ondemand'
    );
    if (actifMembersTab) actifMembers = actifMembersTab;
    const inactifMembersTab = allMembers.filter(
      (memb) => memb.member.relation.toLowerCase() !== 'member'
    );
    if (inactifMembersTab) inactifMembers = inactifMembersTab;
    return { actifMembers, inactifMembers };
  };

  const getSelectedAssoEngagementsTotals = () => {
    const allValidEngagements = selectedAssoState.associationEngagements.filter(
      (engage) => engage.accord === true
    );
    let totalMontant = 0;
    allValidEngagements.forEach((engage) => {
      totalMontant += engage.montant;
    });
    return { nombreTotal: allValidEngagements.length, totalMontant };
  };

  const getSelectedAssociationFundInfos = () => {
    let investAmount = 0;
    let gainAmount = 0;
    let depenseAmount = 0;
    let quotiteAmount = 0;
    const validInvestEngagements = selectedAssoState.associationEngagements.filter(
      (engage) => engage.accord === true && engage.typeEngagement.toLowerCase() === 'remboursable'
    );
    validInvestEngagements.forEach((engagement) => {
      investAmount += engagement.montant;
    });
    const validDepenseEngagements = selectedAssoState.associationEngagements.filter(
      (engage) => engage.accord === true && engage.typeEngagement.toLowerCase() !== 'remboursable'
    );

    validDepenseEngagements.forEach((item) => {
      depenseAmount += item.montant;
    });

    const gainEngagements = selectedAssoState.associationEngagements.filter(
      (engage) => engage.accord === true && engage.statut.toLowerCase === 'ended'
    );
    gainEngagements.forEach((engage) => {
      gainAmount += engage.interetMontant;
    });

    const securityAmount =
      (selectedAssoState.selectedAssociation.solde *
        selectedAssoState.selectedAssociation.seuilSecurite) /
      100;
    quotiteAmount = Math.round(selectedAssoState.selectedAssociation.solde - securityAmount);
    return { investAmount, gainAmount, depenseAmount, quotiteAmount };
  };
  return {
    getselectedAssoMembers,
    getSelectedAssoMembersCotisations,
    getSelectedAssoAllCotisations,
    getMemberCotisationsInfo,
    getSelectedMembersAllCotisations,
    getSelectedAssoCurrentMembers,
    getSelectedAssoMembersEngagements,
    getSelectedAssoEngagementsTotals,
    getSelectedAssociationFundInfos,
  };
}
