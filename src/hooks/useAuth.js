import { useContext } from 'react';
import { login } from '../api/services/authServices';
import { getAllTransactions } from '../api/services/transactionServices';
import { AuthContext } from '../contexts/AuthContext';
import { SelectedAssociationContext } from '../contexts/SelectedAssociationContext';
import { TransactionContext } from '../contexts/TransactionContext';
import { actions } from '../reducers/authReducer';
import { transactionActions } from '../reducers/transactionReducer';
import { removeItem, storeToken } from '../storage/authStorage';

export default function useAuth() {
  const { state, dispatch } = useContext(AuthContext);
  const { selectedAssoState } = useContext(SelectedAssociationContext);
  const { dispatchTransaction } = useContext(TransactionContext);
  const user = state.user;

  const isAdmin = () => {
    let isMemberAdmin = false;
    const userRoles = user?.roles;
    if (userRoles && userRoles.length > 0) {
      const adminIndex = userRoles.findIndex((role) => role === 'ROLE_ADMIN');
      if (adminIndex !== -1) isMemberAdmin = true;
    }
    return isMemberAdmin;
  };

  const isModerator = () => {
    let isModarat = false;
    if (selectedAssoState.connectedMember.member?.statut.toLowerCase() === 'moderator')
      isModarat = true;
    /* if (memberRoles.length > 0) {
      const modIndex = memberRoles.findIndex((role) => role === 'ROLE_MODERATOR');
      if (modIndex !== -1) {
        isModarat = true;
      }
    } */
    return isModarat;
  };

  const transformUserData = (data) => {
    const newUser = { ...data.user, token: data.accessToken, roles: data.roles };
    return newUser;
  };

  const getUserLoggedIn = async (user) => {
    let error = null;
    const response = await login(user);
    if (!response.ok) return (error = response.data.message);
    const newUser = transformUserData(response.data);
    storeToken(response.data.accessToken);
    dispatch({ type: actions.loginOrRegister, user: newUser });
    return error;
  };

  const getTransactions = async () => {
    let errorState = null;
    let data = [];
    const response = await getAllTransactions({ userId: state.user.id });
    if (!response.ok) {
      errorState = response.data;
      alert("Nous n'avons pas pu recupérer vos anciennes transactions.");
      return;
    }
    data = response.data;
    dispatchTransaction({ type: transactionActions.all_user_transaction, list: response.data });
    return { errorState, data };
  };

  const getLogout = () => removeItem();

  return { transformUserData, getUserLoggedIn, isAdmin, getTransactions, isModerator, getLogout };
}
