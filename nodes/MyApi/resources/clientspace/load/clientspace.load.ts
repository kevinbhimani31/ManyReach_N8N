import { ILoadOptionsFunctions } from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';

/**
 * Load clientspaces for dropdown
 */
export async function loadClientspacesForDropdown(this: ILoadOptionsFunctions) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/clientspaces');
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return items.map((item: any) => ({
    name: item.name || item.title || item.email || `Clientspace #${item.id}`,
    value: item.campaignId || item.followupId || item.sequenceId || item.userId || item.organizationId || item.clientspaceId || item.workspaceId || item.id || item.listId || item.prospectId || item.tagId || item.senderId,
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
      name: item.name || item.title || item.email || `Clientspace #${item.id}`,
      value: item.campaignId || item.followupId || item.sequenceId || item.userId || item.organizationId || item.clientspaceId || item.workspaceId || item.id || item.listId || item.prospectId || item.tagId || item.senderId,
      url: `/api/v2/clientspaces/${item.id}`,
    })),
  };
}
