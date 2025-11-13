import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function loadCampaignsForDropdown(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const response = await apiRequest.call(this, 'GET', '/campaigns', {}, { limit: 200 });

  let campaigns: any[] = [];

  if (Array.isArray(response)) {
    campaigns = response;
  } else if (Array.isArray(response?.data)) {
    campaigns = response.data;
  } else if (Array.isArray(response?.items)) {
    campaigns = response.items;
  } else if (Array.isArray(response?.records)) {
    campaigns = response.records;
  } else {
    throw new Error('Unexpected API response format for /campaigns');
  }

  return campaigns.map((campaign: any) => ({
    name: campaign.Name ?? campaign.name ?? campaign.Title ?? campaign.title ?? `Campaign ${campaign.Id ?? campaign.id}`,
    value: campaign.Id ?? campaign.id ?? campaign.CampaignId ?? campaign.campaignId,
  })).filter((option) => option.value !== undefined && option.value !== null && option.value !== '');
}

