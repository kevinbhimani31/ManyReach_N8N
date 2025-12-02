import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * GetFollowups sequence
 * Returns all follow-ups associated with the specified sequence for the authenticated organization.
            
Behavior:
- Validates API key and organization.
- Verifies sequence and related campaign exist and are owned by the org.
- Retrieves all follow-ups for the sequence and maps to response.
- If none, returns empty list; otherwise returns full list of follow-ups. Handles all error branches.
 */
export async function getFollowupsSequence(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('sequenceId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  
  
  const body = {};
  
  const qs: any = {};
  
  
  const response = await apiRequest.call(this, 'GET', `/api/v2/sequences/${id}/followups`, body, qs);
  return response;
}
