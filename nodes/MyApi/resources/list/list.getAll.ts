import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensurePagination } from '../../helpers/validation';

/**
 * Get all lists
 * Returns all mailing lists for the authenticated organization.

Behavior:
- Authenticates API key and organization.
- Retrieves list data from repository.
- Orders lists by Title (descending).
- Returns list data including metadata.
 */
export async function getAllLists(this: IExecuteFunctions, index: number) {
  const page = this.getNodeParameter('page', index, 1) as number;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  
  ensurePagination(page, limit);
  
  const response = await apiRequest.call(this, 'GET', '/api/v2/lists', {}, { page, limit });
  
  return {
    items: response?.data ?? response?.items ?? response ?? [],
    pagination: { page, limit, total: response?.total ?? null },
  };
}
