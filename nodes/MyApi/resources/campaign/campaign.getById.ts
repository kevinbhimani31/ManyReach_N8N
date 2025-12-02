import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Get campaign by ID
 * Retrieves campaign details by campaign ID for the authenticated organization.
            
Behavior:
- Extracts and validates the API key (from header or query).
- Authenticates organization using the API key.
- Validates that the campaign exists and is owned by the organization.
- Returns campaign details: name, status, creation date, engagement metrics, or 404/403 accordingly.
 */
export async function getCampaignById(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('campaignId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'GET', `/api/v2/campaigns/${id}`);
  return response;
}
