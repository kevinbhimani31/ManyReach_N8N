import { ILoadOptionsFunctions } from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';

/**
 * Load whitelabels for dropdown
 */
export async function loadWhitelabelsForDropdown(this: ILoadOptionsFunctions) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/whitelabels');
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return items.map((item: any) => ({
    name: item.name || item.title || `Whitelabel #${item.id}`,
    value: item.id,
  }));
}

/**
 * Search whitelabels for resource locator
 */
export async function searchWhitelabelsForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string
) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/whitelabels', {}, { search: filter });
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return {
    results: items.map((item: any) => ({
      name: item.name || item.title || `Whitelabel #${item.id}`,
      value: item.id,
      url: `/api/v2/whitelabels/${item.id}`,
    })),
  };
}
