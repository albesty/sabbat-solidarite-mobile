import { useContext, useState } from 'react';
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
    const allCotisations = selectedAssoState.associationCotisations;
    const memberCotisations = allCotisations[memberId];
    if (memberCotisations && memberCotisations.length > 0) {
      nombreCotisations = memberCotisations.length;
      memberCotisations.forEach((cotis) => {
        totalCotisationsMontant += cotis.montant;
      });
    }
    return { nombreCotisations, totalCotisationsMontant };
  };

  const notPayedCompter = (member) => {
    let compter = 0;
    if (member) {
      const memberCotisation = listCotisations[member.id];
      if (memberCotisation) {
        const notPayedArray = associationCotisations.filter(
          (cotis) => !memberCotisation.some((select) => select.id === cotis.id)
        );
        if (notPayedArray && notPayedArray.length > 0) compter = notPayedArray.length;
      }
    }

    return compter;
  };

  return {
    getselectedAssoMembers,
    getSelectedAssoMembersCotisations,
    getSelectedAssoAllCotisations,
    getMemberCotisationsInfo,
  };
}
