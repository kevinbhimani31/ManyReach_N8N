import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { loadDropdown, searchResourceLocator } from '../../../helpers/searchHelper';
import { apiRequest } from '../../../helpers/apiRequest';
import { extractArray } from '../../../helpers/response.convert';

async function fetchSenders(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const response = await apiRequest.call(this, 'GET', '/senders', {}, { limit: 200 });
  const senders: any[] = extractArray(response, 'senders');
  return senders.map((sender: any) => ({
    name: sender.email ?? sender.Email ?? sender.Email ?? `Sender ${sender.Id ?? sender.Id ?? sender.Id ?? sender.ID}`,
    value: sender.senderId ?? sender.Id ?? sender.Id ?? sender.ID,
  })).filter((option) => option.value !== undefined && option.value !== null && option.value !== '');
}

export async function loadSendersForDropdown(
  this: ILoadOptionsFunctions,
) {
  return loadDropdown.call(this, fetchSenders);
}

export async function searchSendersForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string,
) {
  return searchResourceLocator.call(this, fetchSenders, filter);
}
