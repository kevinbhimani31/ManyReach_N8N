import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Get prospect by ID
 * Retrieves a specific prospect by its ID.
Supports optional includes via `?include=campaignIds,listIds,tagIds` parameter.
            
Behavior:
- Authenticates API request
- Validates prospect ID
- Verifies prospect belongs to authenticated organization
- Returns prospect details as DTO
- Include parameter loads related entity IDs in single DB query
 */
export async function getProspectById(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('prospectId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'GET', `/api/v2/prospects/${id}`);
  return response;
}
