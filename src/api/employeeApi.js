import apiClient from './apiClient';

/** GET /employees */
export const getAllEmployees = (params) =>
  apiClient.get('/employees', { params });

/** GET /employees/:id */
export const getEmployeeById = (id) =>
  apiClient.get(`/employees/${id}`);

/** POST /employees */
export const createEmployee = (data) =>
  apiClient.post('/employees', data);

/** PUT /employees/:id */
export const updateEmployee = (id, data) =>
  apiClient.put(`/employees/${id}`, data);

/** DELETE /employees/:id */
export const deleteEmployee = (id) =>
  apiClient.delete(`/employees/${id}`);

/** GET /employees/search?query=... */
export const searchEmployees = (query) =>
  apiClient.get('/employees/search', { params: { query } });
