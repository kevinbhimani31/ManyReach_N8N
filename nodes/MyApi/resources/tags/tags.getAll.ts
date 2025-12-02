import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensurePagination } from '../../helpers/validation';

/**
 * Get all tagss
 * Retrieves all tags for the authenticated organization with optional filters.
            
Behavior:
- Authenticates API request
- Applies optional search filter (case-insensitive substring match)
- Optionally includes prospect count via include=prospectCount
- Returns paginated list of tags
 */
export async function getAllTagss(this: IExecuteFunctions, index: number) {
  const page = this.getNodeParameter('page', index, 1) as number;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  
  ensurePagination(page, limit);
  
  const response = await apiRequest.call(this, 'GET', '/api/v2/tags', {}, { page, limit });
  
  return {
    items: response?.data ?? response?.items ?? response ?? [],
    pagination: { page, limit, total: response?.total ?? null },
  };
}
