import apiClient from '../client';

const url = '/associations/';

const createAssociation = (association) => apiClient.post(url, association);

const getAll = () => apiClient.get(url);

const updateAvatar = (data) => apiClient.patch(`${url}updateAvatar`, data);

const updateReglement = (data) => apiClient.post(`${url}updateReglement`, data);

export { createAssociation, getAll, updateAvatar, updateReglement };
