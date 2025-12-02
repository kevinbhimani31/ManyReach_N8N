import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Delete sequence
 * Deletes a sequence by ID for the authenticated organization and campaign (soft delete, also removes followups).
            
Behavior:
- Validates API key (header/query), sequence ID, campaign/sequence existence and ownership.
- Performs soft delete on sequence and all related followups.
- Clears related caches and returns deleted sequence or error result.
 */
export async function deleteSequence(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('sequenceId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'DELETE', `/api/v2/sequences/${id}`);
  return response;
}
