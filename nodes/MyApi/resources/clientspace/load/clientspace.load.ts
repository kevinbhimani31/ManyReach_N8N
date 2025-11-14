import {
  ILoadOptionsFunctions,
  INodePropertyOptions,
} from 'n8n-workflow';
import { loadDropdown, searchResourceLocator } from '../../../helpers/searchHelper';
import { apiRequest } from '../../../helpers/apiRequest';
import { extractArray } from '../../../helpers/response.convert';

async function fetchClientspaces(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const response = await apiRequest.call(this, 'GET', '/clientspaces', {}, { limit: 10 });

  let clientspaces: any[] = extractArray (response, 'clientspaces');


  return clientspaces.map((clientspace: any) => ({
    name: clientspace.Title ?? clientspace.title ?? `Clientspace ${clientspace.ClientspaceId ?? clientspace.clientspaceId}`,
    value: clientspace.ClientspaceId ?? clientspace.clientspaceId ?? clientspace.clientspaceid,
  })).filter((option) => option.value !== undefined && option.value !== null && option.value !== '');
}

export async function loadClientspacesForDropdown
(
  this: ILoadOptionsFunctions,
) 
{
  return loadDropdown.call(this, fetchClientspaces);
}

export async function searchClientspacesForResourceLocator
(
  this: ILoadOptionsFunctions,
  filter?: string,
) 
{
  return searchResourceLocator.call(this, fetchClientspaces, filter);
}
