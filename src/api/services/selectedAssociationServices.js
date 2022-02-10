import apiClient from '../client';

const url = '/members';
const getAssoMembers = (data) => apiClient.post(`${url}/byAssociation`, data);

const getAssoMembersCotisations = (data) => apiClient.post(`${url}/membersCotisations`, data);
const addCotisation = (data) => apiClient.post('/cotisations', data);
const getAllCotisations = (data) => apiClient.post('/cotisations/byAssociation', data);

export { getAssoMembers, getAssoMembersCotisations, addCotisation, getAllCotisations };
