import {
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
  INodePropertyOptions,
} from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';

async function fetchClientspaces(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const response = await apiRequest.call(this, 'GET', '/clientspaces', {}, { limit: 200 });

  let clientspaces: any[] = [];

  if (Array.isArray(response)) {
    clientspaces = response;
  } else if (Array.isArray(response?.data)) {
    clientspaces = response.data;
  } else if (Array.isArray(response?.items)) {
    clientspaces = response.items;
  } else if (Array.isArray(response?.records)) {
    clientspaces = response.records;
  } else {
    throw new Error('Unexpected API response format for /clientspaces');
  }

  return clientspaces.map((clientspace: any) => ({
    name: clientspace.Title ?? clientspace.title ?? `Clientspace ${clientspace.ClientspaceId ?? clientspace.clientspaceId}`,
    value: clientspace.ClientspaceId ?? clientspace.clientspaceId ?? clientspace.clientspaceid,
  })).filter((option) => option.value !== undefined && option.value !== null && option.value !== '');
}

export async function loadClientspacesForDropdown(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  return fetchClientspaces.call(this);
}

export async function searchClientspacesForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const options = await fetchClientspaces.call(this);

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

