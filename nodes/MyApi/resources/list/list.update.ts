import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Update list
 * Updates specified fields of a list.

Behavior:
- Authenticates API request
- Validates list ID
- Updates only provided fields
- Returns updated list details
 */
export async function updateList(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('listId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const updateFields = this.getNodeParameter('updateFields', index, {}) as any;
  
  const response = await apiRequest.call(this, 'PUT', `/api/v2/lists/${id}`, updateFields);
  return response;
}
