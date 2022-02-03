import apiClient from '../client';

const url = '/members';

const sendAdhesionMessage = (data) => apiClient.patch(`${url}/sendAdhesionMessage`, data);

const getConnectedUserAssociations = () => apiClient.get(`${url}/associations`);

export { sendAdhesionMessage, getConnectedUserAssociations };
