import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useContext } from 'react';
import { getAll } from '../api/services/associationServices';
import { sendAdhesionMessage } from '../api/services/memberServices';
import { AssociationContext } from '../contexts/AssociationContext';
import { MemberContext } from '../contexts/MemberContext';
import routes from '../navigation/routes';
import { associationsActions } from '../reducers/associationReducer';
import { memberActions } from '../reducers/memberReducer';

export default function useAssociation() {
  const { associationDispatch } = useContext(AssociationContext);
  const { dispatch } = useContext(MemberContext);

  const navigation = useNavigation();

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

  const showLargeImage = (url) => {
    if (!url) {
      return;
    }
    const params = {
      url,
    };
    navigation.navigate(routes.SHOW_IMAGE, params);
  };

  const sendAdhesionMessageToAssociation = async (data) => {
    let errorState = null;
    const response = await sendAdhesionMessage(data);
    if (!response.ok) {
      errorState = response.data;
      alert('Erreur: Nous avons rencontré un problème lors du traitement de votre requête.');
      return;
    }
    dispatch({ type: memberActions.SEND_ADHESION_MESSAGE, list: response.data });
    return errorState;
  };

  return {
    getAssociationsList,
    formatFonds,
    formatDate,
    dataSorter,
    showLargeImage,
    sendAdhesionMessageToAssociation,
  };
}
