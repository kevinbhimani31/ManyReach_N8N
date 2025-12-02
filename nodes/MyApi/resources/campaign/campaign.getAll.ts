import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensurePagination } from '../../helpers/validation';

/**
 * Get all campaigns
 * Retrieves campaigns belonging to the authenticated organization.  

### Behavior
- Extracts and validates the API key (from header or query).  
- Authenticates the organization using the API key.  
- Retrieves campaigns ordered by <b>name (descending)</b>.  
- Supports <b>offset pagination</b> via page + limit.  
- Supports <b>cursor-based pagination</b> via starting_after.  
- Returns a paginated response with TotalRecords, Page, and PageSize.
 */
export async function getAllCampaigns(this: IExecuteFunctions, index: number) {
  const page = this.getNodeParameter('page', index, 1) as number;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  
  ensurePagination(page, limit);
  
  const response = await apiRequest.call(this, 'GET', '/api/v2/campaigns', {}, { page, limit });
  
  return {
    items: response?.data ?? response?.items ?? response ?? [],
    pagination: { page, limit, total: response?.total ?? null },
  };
}
