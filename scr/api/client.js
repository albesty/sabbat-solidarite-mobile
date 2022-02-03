import { create } from 'apisauce';
import settings from './settings';
import { getToken } from '../storage/authStorage';

const apiClient = create({
  baseURL: settings.baseUrl,
});

apiClient.addAsyncRequestTransform(async (request) => {
  const userToken = await getToken();
  if (!userToken) return;
  request.headers['x-access-token'] = userToken;
});
export default apiClient;
