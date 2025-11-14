import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureId, extractNumericId } from '../../helpers/validation';

export async function deleteCampaign(this: IExecuteFunctions, index: number) {
  const rawCampaignId = this.getNodeParameter('campaignId', index) as any;
  const campaignId = extractNumericId(rawCampaignId, 'Campaign ID');
  ensureId(campaignId);

  // depending on API semantics, you may do soft-delete or hard-delete
  const response = await apiRequest.call(this, 'DELETE', `/campaigns/${campaignId}`);

  // If API returns no content, return success body
  return response ?? { success: true, id: campaignId };
}
