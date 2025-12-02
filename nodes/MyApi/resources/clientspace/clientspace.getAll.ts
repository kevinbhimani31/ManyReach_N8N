import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensurePagination } from '../../helpers/validation';

/**
 * Get all clientspaces
 * Retrieves all clientspaces under the authenticated parent organization (agency).

Behavior:
- Authenticates via API key
- Only lists clientspaces for parent org
- Utilizes whitelabel cache for count
- Returns items and total count
 */
export async function getAllClientspaces(this: IExecuteFunctions, index: number) {
  const page = this.getNodeParameter('page', index, 1) as number;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  
  ensurePagination(page, limit);
  
  const response = await apiRequest.call(this, 'GET', '/api/v2/clientspaces', {}, { page, limit });
  
  return {
    items: response?.data ?? response?.items ?? response ?? [],
    pagination: { page, limit, total: response?.total ?? null },
  };
}
