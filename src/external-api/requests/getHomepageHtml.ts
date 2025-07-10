import { api } from '../api';
import { API_ENDPOINTS } from '../endpoints';

export const getHomepageHtml = async () => {
  return await api.get(API_ENDPOINTS.homepage).text();
};
