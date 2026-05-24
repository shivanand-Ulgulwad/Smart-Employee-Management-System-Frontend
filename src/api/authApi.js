import apiClient from './apiClient';

/** POST /auth/login */
export const loginApi = (credentials) =>
  apiClient.post('/auth/login', credentials);

/** POST /auth/forgot-password */
export const forgotPasswordApi = (data) =>
  apiClient.post('/auth/forgot-password', data);

/** POST /auth/logout (optional) */
export const logoutApi = () =>
  apiClient.post('/auth/logout');
