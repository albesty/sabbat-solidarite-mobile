import apiClient from '../client';

const url = '/transactions';

const addNewTransaction = (data) => apiClient.post(`${url}/`, data);
const getAllTransactions = (data) => apiClient.post(`${url}/byUser`, data);

export { addNewTransaction, getAllTransactions };
