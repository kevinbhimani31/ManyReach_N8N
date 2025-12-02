import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Update prospect
 * Updates specified fields of a prospect. Only provided fields are updated.
Replaces the deprecated /status/patch endpoint.
            
Behavior:
- Authenticates API request
- Validates prospect ID
- Verifies prospect belongs to authenticated organization
- Updates only provided fields
- Returns updated prospect as DTO
 */
export async function updateProspect(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('prospectId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const updateFields = this.getNodeParameter('updateFields', index, {}) as any;
  
  const response = await apiRequest.call(this, 'PUT', `/api/v2/prospects/${id}`, updateFields);
  return response;
}
