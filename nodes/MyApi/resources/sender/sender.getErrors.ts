import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * GetErrors sender
 * Returns error logs associated with a sender account.

Behavior:
- Authenticates and checks sender ID.
- Gets error records for sender.
- Returns all matching errors or not found if none.
 */
export async function getErrorsSender(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('senderId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  
  
  const body = {};
  
  const qs: any = {};
  
  
  const response = await apiRequest.call(this, 'GET', `/api/v2/senders/${id}/errors`, body, qs);
  return response;
}
