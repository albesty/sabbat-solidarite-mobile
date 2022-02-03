import { useContext } from 'react';
import { getAll } from '../api/services/associationServices';
import { AssociationContext } from '../contexts/AssociationContext';
import { associationsActions } from '../reducers/associationReducer';

export default function useAssociation() {
  const { dispatch } = useContext(AssociationContext);

  const getAssociationsList = async () => {
    let error = null;
    const listResponse = await getAll();
    if (!listResponse.ok) return (error = listResponse.data?.message);
    dispatch({ type: associationsActions.GET_ALL, list: listResponse.data });
    return error;
  };

  const formatFonds = (fonds) => {
    const formated = fonds?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formated} XOF`;
  };

  return { getAssociationsList, formatFonds };
}
