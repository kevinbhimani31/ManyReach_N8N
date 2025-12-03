import { ILoadOptionsFunctions } from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';

/**
 * Load workspaces for dropdown
 */
export async function loadWorkspacesForDropdown(this: ILoadOptionsFunctions) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/workspaces');
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return items.map((item: any) => ({
    name: item.name || item.title || item.email || `Workspace #${item.id}`,
    value: item.campaignId || item.followupId || item.sequenceId || item.userId || item.organizationId || item.clientspaceId || item.workspaceId || item.id || item.listId || item.prospectId || item.tagId || item.senderId,
  }));
}

/**
 * Search workspaces for resource locator
 */
export async function searchWorkspacesForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string
) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/workspaces', {}, { search: filter });
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return {
    results: items.map((item: any) => ({
      name: item.name || item.title || item.email || `Workspace #${item.id}`,
      value: item.campaignId || item.followupId || item.sequenceId || item.userId || item.organizationId || item.clientspaceId || item.workspaceId || item.id || item.listId || item.prospectId || item.tagId || item.senderId,
      url: `/api/v2/workspaces/${item.id}`,
    })),
  };
}
