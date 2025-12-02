import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Update sender
 * Updates editable properties on an existing sender account.

Behavior:
- Authenticates request and validates sender ID.
- Checks sender belongs to org; skips forbidden changes.
- Applies allowed field changes only.
- Persists and returns update result or validation errors.
 */
export async function updateSender(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('senderId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const updateFields = this.getNodeParameter('updateFields', index, {}) as any;
  
  const response = await apiRequest.call(this, 'PUT', `/api/v2/senders/${id}`, updateFields);
  return response;
}
