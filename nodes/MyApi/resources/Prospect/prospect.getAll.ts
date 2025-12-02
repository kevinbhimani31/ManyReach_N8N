import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensurePagination } from '../../helpers/validation';

/**
 * Get all prospects
 * Returns prospects for the authenticated organization with optional filters.
Supports email-to-ID lookup via `?email=` parameter.
            
Behavior:
- Authenticates API request
- Applies optional filters (email, status, tags, search)
- Returns paginated list of prospects as DTOs
- When email filter is used, returns single prospect (for ID lookup)
 */
export async function getAllProspects(this: IExecuteFunctions, index: number) {
  const page = this.getNodeParameter('page', index, 1) as number;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  
  ensurePagination(page, limit);
  
  const response = await apiRequest.call(this, 'GET', '/api/v2/prospects', {}, { page, limit });
  
  return {
    items: response?.data ?? response?.items ?? response ?? [],
    pagination: { page, limit, total: response?.total ?? null },
  };
}
