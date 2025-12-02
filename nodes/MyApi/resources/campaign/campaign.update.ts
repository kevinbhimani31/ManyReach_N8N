import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Update campaign
 * Updates only supplied fields for a single campaign by ID.
            
Behavior:
- Extracts and validates API key (header or query).
- Authenticates org using API key.
- Validates the campaign ID and request body.
- Applies non-null valid fields as a PATCH (partial update).
- Validates special fields (emails, time windows, DelayMin/Max, etc).
- Logs and returns change details, errors, or forbidden/not found/responses as needed.
 */
export async function updateCampaign(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('campaignId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const updateFields = this.getNodeParameter('updateFields', index, {}) as any;
  
  const response = await apiRequest.call(this, 'PUT', `/api/v2/campaigns/${id}`, updateFields);
  return response;
}
