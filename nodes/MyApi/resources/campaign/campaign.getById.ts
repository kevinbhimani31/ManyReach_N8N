import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureId } from '../../helpers/validation';

export async function getCampaignById(this: IExecuteFunctions, index: number) {
  const id = this.getNodeParameter('campaignId', index, 0) as number;
  ensureId(id);

  const response = await apiRequest.call(this, 'GET', `/campaigns/${id}`);

  if (!response) {
    throw new Error(`Campaigns with ID ${id} not found`);
  }

  return response;
}
