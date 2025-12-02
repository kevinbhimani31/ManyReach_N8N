import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Get followup by ID
 * Retrieves the full details for a single follow-up in a campaign sequence, for the authenticated org.
            
Behavior:
- Validates API key, follow-up ID, and related campaign ownership.
- Looks up follow-up record, handles not-found and org ownership failures.
- Maps follow-up to API response model and returns result, or error if any step fails.
 */
export async function getFollowupById(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('followupId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'GET', `/api/v2/followups/${id}`);
  return response;
}
