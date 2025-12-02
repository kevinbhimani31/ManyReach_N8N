import { ILoadOptionsFunctions } from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';

/**
 * Load tagss for dropdown
 */
export async function loadTagssForDropdown(this: ILoadOptionsFunctions) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/tagss');
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return items.map((item: any) => ({
    name: item.name || item.title || `Tags #${item.id}`,
    value: item.id,
  }));
}

/**
 * Search tagss for resource locator
 */
export async function searchTagssForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string
) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/tagss', {}, { search: filter });
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return {
    results: items.map((item: any) => ({
      name: item.name || item.title || `Tags #${item.id}`,
      value: item.id,
      url: `/api/v2/tagss/${item.id}`,
    })),
  };
}
