import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Delete sender
 * Deletes (deactivates) a sender email account from the current organization.

Behavior:
- Authenticates API/org context.
- Validates sender ID and removes it from active senders.
- Also removes from warm-up campaign if present.
- Returns success or error result.
 */
export async function deleteSender(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('senderId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'DELETE', `/api/v2/senders/${id}`);
  return response;
}
