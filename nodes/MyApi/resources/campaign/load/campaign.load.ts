import { ILoadOptionsFunctions } from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';

/**
 * Load campaigns for dropdown
 */
export async function loadCampaignsForDropdown(this: ILoadOptionsFunctions) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/campaigns');
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return items.map((item: any) => ({
    name: item.name || item.title || `Campaign #${item.id}`,
    value: item.campaignId,
  }));
}

/**
 * Search campaigns for resource locator
 */
export async function searchCampaignsForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string
) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/campaigns', {}, { search: filter });
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return {
    results: items.map((item: any) => ({
      name: item.name || item.title || `Campaign #${item.id}`,
      value: item.campaignId,
      url: `/api/v2/campaigns/${item.id}`,
    })),
  };
}
