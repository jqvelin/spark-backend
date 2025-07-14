import { dataApi } from '../dataApi';
import { DATA_API_ENDPOINTS } from '../endpoints';

export const getSearchResultsPageHtml = async (searchQuery: string) => {
  return await dataApi.get(DATA_API_ENDPOINTS.searchResults(searchQuery)).text();
};
