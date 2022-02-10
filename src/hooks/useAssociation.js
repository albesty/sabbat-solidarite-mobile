import dayjs from 'dayjs';
import { useContext } from 'react';
import { getAll } from '../api/services/associationServices';
import { AssociationContext } from '../contexts/AssociationContext';
import { associationsActions } from '../reducers/associationReducer';

export default function useAssociation() {
  const { associationDispatch } = useContext(AssociationContext);

  const getAssociationsList = async () => {
    let error = null;
    const listResponse = await getAll();
    if (!listResponse.ok) return (error = listResponse.data?.message);
    associationDispatch({ type: associationsActions.GET_ALL, list: listResponse.data });
    return error;
  };

  const formatFonds = (fonds) => {
    const formated = fonds?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formated} XOF`;
  };

  const formatDate = (date) => {
    let formated = '';
    if (date) {
      formated = dayjs(date).format('DD/MM/YYYY HH:mm:ss');
    }
    return formated;
  };

  const dataSorter = (data) => {
    let sortedData = [];
    if (data && data.length > 0) {
      sortedData = data.sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return 0;
      });
    }
    return sortedData;
  };

  return { getAssociationsList, formatFonds, formatDate, dataSorter };
}
