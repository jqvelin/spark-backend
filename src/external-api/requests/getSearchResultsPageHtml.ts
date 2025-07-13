import { api } from '../api';
import { API_ENDPOINTS } from '../endpoints';

export const getSearchResultsPageHtml = async (searchQuery: string) => {
  return await api.get(API_ENDPOINTS.searchResults(searchQuery)).text();
};
