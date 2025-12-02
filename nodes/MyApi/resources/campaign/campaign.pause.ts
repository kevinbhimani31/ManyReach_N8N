import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Pause campaign
 * Pauses an active campaign to temporarily stop sending messages
 */
export async function pauseCampaign(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('campaignId', index) as any;
  const id = extractResourceId(resourceLocator);
  
  
  
  const body = {};
  
  const qs: any = {};
  
  
  const response = await apiRequest.call(this, 'POST', `/api/v2/campaigns/${id}/pause`, body, qs);
  return response;
}
