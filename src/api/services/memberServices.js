import apiClient from '../client';

const url = '/members';

const sendAdhesionMessage = (data) => apiClient.patch(`${url}/sendAdhesionMessage`, data);

const getConnectedUserAssociations = () => apiClient.get(`${url}/associations`);

const payCotisation = (data) => apiClient.patch(`${url}/payCotisations`, data);

export { sendAdhesionMessage, getConnectedUserAssociations, payCotisation };
