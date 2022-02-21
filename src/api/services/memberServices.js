import apiClient from '../client';

const url = '/members';

const sendAdhesionMessage = (data) => apiClient.patch(`${url}/sendAdhesionMessage`, data);
const responseToAdhesionMessage = (data) =>
  apiClient.patch(`${url}/respondToAdhesionMessage`, data);

const getConnectedUserAssociations = () => apiClient.get(`${url}/associations`);

const payCotisation = (data) => apiClient.patch(`${url}/payCotisations`, data);

const leaveAssociation = (data) => apiClient.patch(`${url}/leaveAssociation`, data);
const updateInfo = (data) => apiClient.patch(`${url}/updateOne`, data);

export {
  sendAdhesionMessage,
  getConnectedUserAssociations,
  payCotisation,
  responseToAdhesionMessage,
  leaveAssociation,
  updateInfo,
};
