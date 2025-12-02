import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Get sender by ID
 * Retrieves detailed info for a sender by unique sender ID.

Behavior:
- Authenticates request.
- Validates sender ID.
- Checks sender belongs to the organization.
- Returns sender DTO or error if not found.
 */
export async function getSenderById(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('senderId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'GET', `/api/v2/senders/${id}`);
  return response;
}
