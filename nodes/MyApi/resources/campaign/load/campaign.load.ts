import {
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
  INodePropertyOptions,
} from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';
import { extractArray } from '../../../helpers/response.convert';

async function fetchCampaignOptions(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const response = await apiRequest.call(this, 'GET', '/campaigns', {}, { limit: 10 });

  let campaigns: any[] = extractArray(response, 'campaigns');


  return campaigns.map((campaign: any) => ({
    name: campaign.Name ?? campaign.name ?? campaign.Title ?? campaign.title ?? `Campaign ${campaign.Id ?? campaign.id}`,
    value: campaign.Id ?? campaign.id ?? campaign.CampaignId ?? campaign.campaignId,
  })).filter((option) => option.value !== undefined && option.value !== null && option.value !== '');

}

export async function loadCampaignsForDropdown(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  return fetchCampaignOptions.call(this);
}

export async function searchCampaignsForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const options = await fetchCampaignOptions.call(this);

  const normalizedFilter = filter?.toLowerCase();
  const results: INodeListSearchItems[] = options
    .filter((option) => {
      if (!normalizedFilter || !option.name) return true;
      return option.name.toLowerCase().includes(normalizedFilter);
    })
    .map((option) => ({
      name: option.name ?? String(option.value),
      value: option.value,
    }));

  return { results };
}

export async function loadSendersForDropdown(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {

  const response = await apiRequest.call(
    this,
    'GET',
    '/senders',
    {},
    { page: 1, limit: 100 }
  );

  let senders: any[] = [];

  if (Array.isArray(response?.items)) {
    senders = response.items;
  } else if (Array.isArray(response)) {
    senders = response;
  } else {
    throw new Error('Unexpected API response format for /v2/senders');
  }

  return senders.map((sender: any) => ({
    name: sender?.email ?? '',
    value: sender?.email,   // You want email as the value for From Email
  }));
}
