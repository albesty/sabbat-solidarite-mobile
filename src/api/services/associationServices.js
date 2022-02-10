import apiClient from '../client';

const url = '/associations/';

const createAssociation = (association) => apiClient.post(url, association);

const getAll = () => apiClient.get(url);

export { createAssociation, getAll };
