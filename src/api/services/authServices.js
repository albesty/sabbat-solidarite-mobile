import apiClient from '../client';

const userUrl = '/user';

const login = (user) => apiClient.post('/auth/signin', user);

const register = (user) => apiClient.post('/auth/signup', user);

const setPushNotifToken = (data) => apiClient.post(`${userUrl}/pushNotifications`, data);

const editUserImage = (data) => apiClient.patch(`${userUrl}/editImages`, data);

const getSelectedUserData = (data) => apiClient.post(`${userUrl}/userData`, data);

const editUserInfo = (data) => apiClient.patch(`${userUrl}/editInfo`, data);

const changePassword = (data) => apiClient.patch(`${userUrl}/changeCredentials`, data);

const getAllUsers = () => apiClient.get(`${userUrl}/allUsers`);
export {
  login,
  register,
  editUserImage,
  getSelectedUserData,
  editUserInfo,
  changePassword,
  setPushNotifToken,
  getAllUsers,
};
