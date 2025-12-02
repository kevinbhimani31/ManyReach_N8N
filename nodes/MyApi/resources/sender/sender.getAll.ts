import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensurePagination } from '../../helpers/validation';

/**
 * Get all senders
 * Returns a paginated list of all senders (email accounts) configured for the authenticated organization with optional filtering.
            
Behavior:
- Authenticates and validates organization context.
- Handles filters: folder, status, warmup, search term.
- Pages and orders results.
- Returns paged list of sender account DTOs.
 */
export async function getAllSenders(this: IExecuteFunctions, index: number) {
  const page = this.getNodeParameter('page', index, 1) as number;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  
  ensurePagination(page, limit);
  
  const response = await apiRequest.call(this, 'GET', '/api/v2/senders', {}, { page, limit });
  
  return {
    items: response?.data ?? response?.items ?? response ?? [],
    pagination: { page, limit, total: response?.total ?? null },
  };
}
