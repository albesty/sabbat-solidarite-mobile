import apiClient from '../client';

const userUrl = '/user';

const login = (user) => apiClient.post('/auth/signin', user);

const register = (user) => apiClient.post('/auth/signup', user);

const editUserImage = (data) => apiClient.patch(`${userUrl}/editImages`, data);

export { login, register, editUserImage };
