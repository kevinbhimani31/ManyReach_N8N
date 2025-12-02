import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Update followup
 * Updates supplied fields for a follow-up email in a campaign sequence belonging to the authenticated org.
            
Behavior:
- Validates API key, follow-up ID, and input model.
- Checks follow-up, campaign, and org association.
- Performs partial, validated update on supplied fields.
- Logs, clears caches, returns changed fields or error status.
 */
export async function updateFollowup(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('followupId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const updateFields = this.getNodeParameter('updateFields', index, {}) as any;
  
  const response = await apiRequest.call(this, 'PUT', `/api/v2/followups/${id}`, updateFields);
  return response;
}
