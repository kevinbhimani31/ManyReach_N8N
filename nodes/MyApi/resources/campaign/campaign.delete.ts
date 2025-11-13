import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureGuid, ensureId } from '../../helpers/validation';

export async function deleteCampaign(this: IExecuteFunctions, index: number) {
  const rawId = this.getNodeParameter('campaignId', index) as string | number;
  const campaignId = normalizeCampaignId(rawId);

  // depending on API semantics, you may do soft-delete or hard-delete
  const response = await apiRequest.call(this, 'DELETE', `/campaigns/${campaignId}`);

  // If API returns no content, return success body
  return response ?? { success: true, id: campaignId };
}

function normalizeCampaignId(id: string | number): string {
  if (typeof id === 'number') {
    ensureId(id);
    return id.toString();
  }

  const trimmedId = id.trim();
  if (!trimmedId) {
    throw new Error('Campaign ID must be provided');
  }

  if (/^\d+$/.test(trimmedId)) {
    ensureId(Number(trimmedId));
  } else {
    ensureGuid(trimmedId);
  }

  return trimmedId;
}
