import React, { useContext } from 'react';
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

  const isValidEmail = (email) => {
    const re =
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/;
    return re.test(email);
  };

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

  const getTransactions = async (userId) => {
    let errorState = null;
    let data = [];
    const id = isAdmin() ? userId : state.user.id;
    const response = await getAllTransactions({ userId: id });
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

  const getMemberStatut = (statut) => {
    let memberStatut = 'ORDINAIRE';
    const currentStatut = statut.toLowerCase();
    if (currentStatut === 'moderator') memberStatut = 'MODERATEUR';
    if (currentStatut === 'admin') memberStatut = 'ADMINISTRATEUR';
    if (currentStatut === 'new') memberStatut = 'NOUVEAU';
    if (
      currentStatut !== 'moderator' &&
      currentStatut !== 'admin' &&
      currentStatut !== 'ordinaire' &&
      currentStatut !== 'new'
    )
      memberStatut = currentStatut.toUpperCase();

    return memberStatut;
  };

  return {
    transformUserData,
    getUserLoggedIn,
    isAdmin,
    getTransactions,
    isModerator,
    getLogout,
    getMemberStatut,
    isValidEmail,
  };
}
