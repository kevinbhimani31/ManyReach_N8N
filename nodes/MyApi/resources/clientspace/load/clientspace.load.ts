import { ILoadOptionsFunctions } from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';

/**
 * Load clientspaces for dropdown
 */
export async function loadClientspacesForDropdown(this: ILoadOptionsFunctions) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/clientspaces');
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return items.map((item: any) => ({
    name: item.name || item.title || `Clientspace #${item.id}`,
    value: item.id,
  }));
}

/**
 * Search clientspaces for resource locator
 */
export async function searchClientspacesForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string
) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/clientspaces', {}, { search: filter });
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return {
    results: items.map((item: any) => ({
      name: item.name || item.title || `Clientspace #${item.id}`,
      value: item.id,
      url: `/api/v2/clientspaces/${item.id}`,
    })),
  };
}
