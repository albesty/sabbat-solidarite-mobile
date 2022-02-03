import { useContext } from 'react';
import { login } from '../api/services/authServices';
import { AuthContext } from '../contexts/AuthContext';
import { actions } from '../reducers/authReducer';
import { removeItem, storeToken } from '../storage/authStorage';

export default function useAuth() {
  const { state, dispatch } = useContext(AuthContext);
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

  /* const isModerator = () => {
    let isModarat = false
    if(memberRoles.length>0) {
        const modIndex = memberRoles.findIndex(role =>role === 'ROLE_MODERATOR')
        if(modIndex !== -1) {
            isModarat = true
        }
    }
    return isModarat
} */

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

  getLogout = () => {
    removeItem();
    dispatch({ type: actions.logout });
  };

  return { transformUserData, getUserLoggedIn, isAdmin, getLogout };
}
