import apiClient from '../client';

const url = '/associations/';

const createAssociation = (association) => apiClient.post(url, association);

const getAll = () => apiClient.get(url);

const updateAvatar = (data) => apiClient.patch(`${url}updateAvatar`, data);

export { createAssociation, getAll, updateAvatar };
