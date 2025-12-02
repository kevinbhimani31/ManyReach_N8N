import { ILoadOptionsFunctions } from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';

/**
 * Load senders for dropdown
 */
export async function loadSendersForDropdown(this: ILoadOptionsFunctions) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/senders');
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return items.map((item: any) => ({
    name: item.name || item.title || `Sender #${item.id}`,
    value: item.id,
  }));
}

/**
 * Search senders for resource locator
 */
export async function searchSendersForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string
) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/senders', {}, { search: filter });
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return {
    results: items.map((item: any) => ({
      name: item.name || item.title || `Sender #${item.id}`,
      value: item.id,
      url: `/api/v2/senders/${item.id}`,
    })),
  };
}
