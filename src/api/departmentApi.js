import apiClient from './apiClient';

/** GET /department/all */
export const getAllDepartments = () =>
  apiClient.get('/department/all');

/** POST /department/add */
export const createDepartment = (data) =>
  apiClient.post('/department/add', data);

/** GET /department/:id/employees */
export const getDepartmentEmployees = (id) =>
  apiClient.get(`/department/${id}/employees`);

/** PUT /department/:id */
export const updateDepartment = (id, data) =>
  apiClient.put(`/department/${id}`, data);

/** DELETE /department/:id */
export const deleteDepartment = (id) =>
  apiClient.delete(`/department/${id}`);
