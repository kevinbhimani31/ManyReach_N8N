import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Delete campaign
 * Deletes a campaign by ID for the authenticated organization.
            
Behavior:
- Extracts and validates the API key (from header or query).
- Authenticates the organization using the API key.
- Checks campaign existence and ownership.
- Performs soft delete and returns deleted campaign, or error result as appropriate.
 */
export async function deleteCampaign(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('campaignId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'DELETE', `/api/v2/campaigns/${id}`);
  return response;
}
