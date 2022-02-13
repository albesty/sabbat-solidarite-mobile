import apiClient from '../client';

const url = '/engagements';
const addEngement = (data) => apiClient.post(url, data);
const getSelectedAssociationEngagements = (data) => apiClient.post(`${url}/byAssociation`, data);
const voteEngagement = (data) => apiClient.patch(`${url}/vote`, data);
const getAllEngagementsVotes = (data) => apiClient.post(`${url}/allVotes`, data);
const payTranche = (data) => apiClient.patch(`${url}/payTranche`, data);

export {
  addEngement,
  getSelectedAssociationEngagements,
  voteEngagement,
  getAllEngagementsVotes,
  payTranche,
};
