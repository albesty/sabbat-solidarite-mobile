import { useContext } from 'react';
import { SelectedAssociationContext } from '../contexts/SelectedAssociationContext';

export default function useCotisation() {
  const { selectedAssoState } = useContext(SelectedAssociationContext);

  const isMemberUpToCotisationDate = (memberId) => {
    let isUpToDate = false;
    const allCotisations = selectedAssoState.allCotisations;
    const membersCotisations = selectedAssoState.associationCotisations;
    const selectedMemberCotisations = membersCotisations[memberId];
    let allCotisationMontant = 0;
    if (allCotisations?.length) {
      for (let i = 0; i < allCotisations.length; i++) {
        const currentCotisation = allCotisations[i];
        allCotisationMontant += currentCotisation.montant;
      }
    }

    let memberCotisMontant = 0;
    if (selectedMemberCotisations?.length) {
      for (let i = 0; i < selectedMemberCotisations.length; i++) {
        const currentMemberCotis = selectedMemberCotisations[i];
        memberCotisMontant += currentMemberCotis.montant;
      }
    }
    if (allCotisationMontant === memberCotisMontant) isUpToDate = true;
    return isUpToDate;
  };

  const isCotisationPayed = (cotisationId) => {
    let isPayed = false;
    const memberCotisations =
      selectedAssoState.associationCotisations[selectedAssoState.connectedMember.member.id];
    if (memberCotisations.length > 0) {
      const isCotisPayed = memberCotisations.some(
        (cotis) => cotis?.id === cotisationId && cotis.member_cotisation?.isPayed === true
      );
      if (isCotisPayed) isPayed = true;
    }
    return isPayed;
  };

  const notPayedCompter = () => {
    let compter = 0;
    const connectedMemberCotisations =
      selectedAssoState.associationCotisations[selectedAssoState.connectedMember.member.id];
    if (connectedMemberCotisations && connectedMemberCotisations.length > 0) {
      const notPayedArray = selectedAssoState.allCotisations.filter(
        (cotis) => !connectedMemberCotisations.some((select) => select.id === cotis.id)
      );
      if (notPayedArray && notPayedArray.length > 0) {
        compter = notPayedArray.length;
      }
    } else {
      compter = selectedAssoState.allCotisations.length;
    }
    return compter;
  };
  return { isMemberUpToCotisationDate, isCotisationPayed, notPayedCompter };
}
