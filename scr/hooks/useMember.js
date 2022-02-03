import { useContext } from 'react/cjs/react.development';
import { getConnectedUserAssociations } from '../api/services/memberServices';
import { MemberContext } from '../contexts/MemberContext';
import { memberActions } from '../reducers/memberReducer';

export default function useMember() {
  const { memberState, dispatch } = useContext(MemberContext);

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

  return { getUserAssociations, getAssociationMemberState };
}
