import { Alert } from 'react-native';
import { useContext } from 'react/cjs/react.development';
import { getConnectedUserAssociations, leaveAssociation } from '../api/services/memberServices';
import { AssociationContext } from '../contexts/AssociationContext';
import { MemberContext } from '../contexts/MemberContext';
import { SelectedAssociationContext } from '../contexts/SelectedAssociationContext';
import { memberActions } from '../reducers/memberReducer';
import { selectedAssoActions } from '../reducers/selectedAssociationReducer';
import useAuth from './useAuth';
import useEngagement from './useEngagement';

export default function useMember() {
  const { dispatch } = useContext(MemberContext);
  const { associationState } = useContext(AssociationContext);
  const { selectedAssoState, dispatchSelectedAsso } = useContext(SelectedAssociationContext);
  const { getSelectedMemberEngagements } = useEngagement();
  const { isAdmin } = useAuth();

  const getUserAssociations = async () => {
    let error = null;
    const response = await getConnectedUserAssociations();
    if (!response.ok) return (error = response.data?.message);
    dispatch({ type: memberActions.LOAD_USER_ASSOCIATION, list: response.data });
    return error;
  };

  const getCurrentUserAssociations = async () => {
    const allAssociations = associationState.list;
    const userAsso = await getUserAssociations();
    const userList = [];
    if (isAdmin()) {
      for (let i = 0; i < allAssociations.lenght; i++) {
        const selected = allAssociations[i];
        const isMember = userAsso.find((item) => item.id === selected.id);
        if (isMember) return;
        else userAsso.push(selected);
      }
    }

    return userAsso;
  };

  const sendLeavingMessage = (member) => {
    Alert.alert('Attention!', 'Voulez-vous quitter definitivement cette association?', [
      {
        text: 'non',
        onPress: () => {
          return;
        },
      },
      {
        text: 'oui',
        onPress: async () => {
          const memberFunds = selectedAssoState.connectedMember.member.fonds;
          const memberEngagements = getSelectedMemberEngagements(
            member.member.id
          ).memberEngagements;

          const isPaying = memberEngagements.some(
            (engage) => engage.statut.toLowerCase() === 'paying'
          );
          if (memberFunds !== 0) {
            alert('Vous devez annuler vos fonds de membre avant de quitter cette association.');
            return;
          }
          if (isPaying) {
            alert('Vous devez achevez vos remboursement avant de quitter cette association.');
            return;
          }
          const response = await leaveAssociation({
            associationId: selectedAssoState.selectedAssociation.id,
            userId: member.id,
          });
          if (!response.ok) {
            alert('Nous avons rencontré un problème, veuillez reesayer plutard.');
            return;
          }
          dispatchSelectedAsso({ type: selectedAssoActions.update_member, member: response.data });
          alert('Votre demande a été envoyée avec succès.');
        },
      },
    ]);
  };

  return { getUserAssociations, getCurrentUserAssociations, sendLeavingMessage };
}
