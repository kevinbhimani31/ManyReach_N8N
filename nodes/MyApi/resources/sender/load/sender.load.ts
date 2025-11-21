import {
  ILoadOptionsFunctions,
  INodeListSearchResult,
  INodePropertyOptions,
} from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';
import { extractArray } from '../../../helpers/response.convert';
import { loadDropdown, searchResourceLocator } from '../../../helpers/searchHelper';

async function fetchSenders(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const response = await apiRequest.call(this, 'GET', '/senders', {}, { page: 1, limit: 200 });

  const senders: any[] = extractArray(response, 'senders');

  return senders
    .map((sender: any) => {
      const value =
        sender?.SenderId ?? sender?.senderId ?? sender?.Id ?? sender?.id ?? sender?.SenderID ?? sender?.senderID;
      const name =
        sender?.Email ?? sender?.email ?? sender?.Address ?? sender?.address ?? `Sender ${value ?? ''}`;
      return { name, value } as INodePropertyOptions;
    })
    .filter((option) => option.value !== undefined && option.value !== null && option.value !== '');
}

export async function loadSendersForIdDropdown(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  return loadDropdown.call(this, fetchSenders);
}

export async function searchSendersForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  return searchResourceLocator.call(this, fetchSenders, filter);
}


