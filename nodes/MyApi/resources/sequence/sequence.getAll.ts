import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureId, extractNumericId } from '../../helpers/validation';

/**
 * Get all sequences for a campaign
 * Endpoint: GET /campaigns/{id}/sequences
 */
export async function getAllSequences(this: IExecuteFunctions, index: number) {
  const rawCampaignId = this.getNodeParameter('campaignId', index) as any;
  const campaignId = extractNumericId(rawCampaignId, 'Campaign ID');
  ensureId(campaignId);

  const response = await apiRequest.call(this, 'GET', `/campaigns/${campaignId}/sequences`);

  return {
    items: response?.data ?? response ?? [],
    pagination: null,
  };
}


