import { useContext } from 'react/cjs/react.development';
import { getConnectedUserAssociations } from '../api/services/memberServices';
import { AssociationContext } from '../contexts/AssociationContext';
import { MemberContext } from '../contexts/MemberContext';
import { memberActions } from '../reducers/memberReducer';
import useAuth from './useAuth';

export default function useMember() {
  const { memberState, dispatch } = useContext(MemberContext);
  const { associationState } = useContext(AssociationContext);
  const { isAdmin } = useAuth();

  const getUserAssociations = async () => {
    let error = null;
    const response = await getConnectedUserAssociations();
    if (!response.ok) return (error = response.data?.message);
    dispatch({ type: memberActions.LOAD_USER_ASSOCIATION, list: response.data });
    return error;
  };

  getAssociationMemberState = (list, associationId) => {
    let currentMemberState = null;
    const selectedAssociation = list.find((item) => item.id === associationId);
    if (selectedAssociation)
      currentMemberState = selectedAssociation.member?.relation?.toLowerCase();
    return currentMemberState;
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

  return { getUserAssociations, getAssociationMemberState, getCurrentUserAssociations };
}
