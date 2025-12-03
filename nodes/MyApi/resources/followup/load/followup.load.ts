import { ILoadOptionsFunctions } from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';

/**
 * Load followups for dropdown
 */
export async function loadFollowupsForDropdown(this: ILoadOptionsFunctions) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/followups');
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return items.map((item: any) => ({
    name: item.name || item.title || item.email || `Followup #${item.id}`,
    value: item.campaignId || item.followupId || item.sequenceId || item.userId || item.organizationId || item.clientspaceId || item.workspaceId || item.id || item.listId || item.prospectId || item.tagId || item.senderId,
  }));
}

/**
 * Search followups for resource locator
 */
export async function searchFollowupsForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string
) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/followups', {}, { search: filter });
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return {
    results: items.map((item: any) => ({
      name: item.name || item.title || item.email || `Followup #${item.id}`,
      value: item.campaignId || item.followupId || item.sequenceId || item.userId || item.organizationId || item.clientspaceId || item.workspaceId || item.id || item.listId || item.prospectId || item.tagId || item.senderId,
      url: `/api/v2/followups/${item.id}`,
    })),
  };
}
