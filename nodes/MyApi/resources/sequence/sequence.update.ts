import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Update sequence
 * Updates supplied fields for a sequence owned by the authenticated organization.
            
Behavior:
- Validates API key and sequence ID.
- Checks ownership through campaign and organization.
- Performs partial update on non-null valid fields only.
- Logs changes, clears caches, returns update result or appropriate error.
 */
export async function updateSequence(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('sequenceId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const updateFields = this.getNodeParameter('updateFields', index, {}) as any;
  
  const response = await apiRequest.call(this, 'PUT', `/api/v2/sequences/${id}`, updateFields);
  return response;
}
