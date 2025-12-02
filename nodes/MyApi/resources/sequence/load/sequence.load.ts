import { ILoadOptionsFunctions } from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';

/**
 * Load sequences for dropdown
 */
export async function loadSequencesForDropdown(this: ILoadOptionsFunctions) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/sequences');
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return items.map((item: any) => ({
    name: item.name || item.title || `Sequence #${item.id}`,
    value: item.id,
  }));
}

/**
 * Search sequences for resource locator
 */
export async function searchSequencesForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string
) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/sequences', {}, { search: filter });
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return {
    results: items.map((item: any) => ({
      name: item.name || item.title || `Sequence #${item.id}`,
      value: item.id,
      url: `/api/v2/sequences/${item.id}`,
    })),
  };
}
