import { dataApi } from '../dataApi';
import { DATA_API_ENDPOINTS } from '../endpoints';

export const getHomepageHtml = async () => {
  return await dataApi.get(DATA_API_ENDPOINTS.homepage).text();
};
