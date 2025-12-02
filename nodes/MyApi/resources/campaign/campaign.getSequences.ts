import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * GetSequences campaign
 * Fetches all sequences for a given campaign ID owned by the authenticated organization.
            
Behavior:
- Validates API key (header/query) and organization.
- Checks that campaign exists and belongs to organization.
- Retrieves sequences and their nested followups and stats for the specified campaign.
- Returns data or error response as appropriate.
 */
export async function getSequencesCampaign(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('campaignId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  
  
  const body = {};
  
  const qs: any = {};
  
  
  const response = await apiRequest.call(this, 'GET', `/api/v2/campaigns/${id}/sequences`, body, qs);
  return response;
}
