import apiClient from './apiClient';

/** GET /salary/payslip/:employeeId */
export const getPayslip = (employeeId) =>
  apiClient.get(`/salary/payslip/${employeeId}`);

/** POST /salary/process */
export const processSalary = (data) =>
  apiClient.post('/salary/process', data);

/** POST /salary/increment */
export const applyIncrement = (data) =>
  apiClient.post('/salary/increment', data);

/** GET /salary/all */
export const getAllSalaries = () =>
  apiClient.get('/salary/all');
