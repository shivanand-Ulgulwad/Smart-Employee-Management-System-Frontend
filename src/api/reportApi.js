import apiClient from './apiClient';

/** GET /reports/highest-salary */
export const getHighestSalaryReport = () =>
  apiClient.get('/reports/highest-salary');

/** GET /reports/avg-department-salary */
export const getAvgDepartmentSalaryReport = () =>
  apiClient.get('/reports/avg-department-salary');

/** GET /reports/top-performers */
export const getTopPerformersReport = () =>
  apiClient.get('/reports/top-performers');

/** GET /reports/monthly-joining */
export const getMonthlyJoiningReport = () =>
  apiClient.get('/reports/monthly-joining');

/** GET /reports/department-distribution */
export const getDepartmentDistribution = () =>
  apiClient.get('/reports/department-distribution');
