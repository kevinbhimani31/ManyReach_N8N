import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Delete followup
 * Deletes (soft delete) a follow-up email for a campaign/sequence owned by the authenticated organization.
            
Behavior:
- Validates API key, follow-up ID, and organization/campaign/sequence.
- Sets follow-up Deleted flag and persists changes.
- Clears all related cache, returns deleted follow-up info or error.
 */
export async function deleteFollowup(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('followupId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'DELETE', `/api/v2/followups/${id}`);
  return response;
}
