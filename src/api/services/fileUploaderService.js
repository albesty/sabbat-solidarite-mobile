import apiClient from '../client';

export const signUploadRequest = (data) => apiClient.post('/uploadFile/s3_upload', data);
