import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Get list by ID
 * Returns details of a single mailing list for the authenticated organization.
            
Behavior:
- Authenticates API request
- Validates list ID
- Retrieves list by ID
- Returns list details
 */
export async function getListById(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('listId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'GET', `/api/v2/lists/${id}`);
  return response;
}
