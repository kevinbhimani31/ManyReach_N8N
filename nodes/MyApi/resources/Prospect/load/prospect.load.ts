import { ILoadOptionsFunctions } from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';

/**
 * Load prospects for dropdown
 */
export async function loadProspectsForDropdown(this: ILoadOptionsFunctions) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/prospects');
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return items.map((item: any) => ({
    name: item.name || item.title || `Prospect #${item.id}`,
    value: item.id,
  }));
}

/**
 * Search prospects for resource locator
 */
export async function searchProspectsForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string
) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/prospects', {}, { search: filter });
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return {
    results: items.map((item: any) => ({
      name: item.name || item.title || `Prospect #${item.id}`,
      value: item.id,
      url: `/api/v2/prospects/${item.id}`,
    })),
  };
}
