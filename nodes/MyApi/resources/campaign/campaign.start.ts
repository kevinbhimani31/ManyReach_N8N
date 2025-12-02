import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Start campaign
 * Initiates a campaign to begin sending messages to its target audience
 */
export async function startCampaign(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('campaignId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  
  
  const body = {};
  
  const qs: any = {};
  
  
  const response = await apiRequest.call(this, 'POST', `/api/v2/campaigns/${id}/start`, body, qs);
  return response;
}
