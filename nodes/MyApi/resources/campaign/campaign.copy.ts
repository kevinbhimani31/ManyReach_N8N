import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Copy campaign
 * Makes a copy of a campaign, including settings, sequences, and follow-ups.
            
Behavior:
- Validates API key and authenticated org.
- Checks campaign ID is provided and positive integer.
- Performs copy operation and assigns new name if given.
- Returns new campaign or error as appropriate.
 */
export async function copyCampaign(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('campaignId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  
  
  const body = {};
  
  const qs: any = {};
  const newCampaignName = this.getNodeParameter('newCampaignName', index, undefined) as any;
  if (newCampaignName !== undefined) {
    qs.newCampaignName = newCampaignName;
  }
  
  const response = await apiRequest.call(this, 'POST', `/api/v2/campaigns/${id}/copy`, body, qs);
  return response;
}
