import {
  ILoadOptionsFunctions,
  INodeListSearchResult,
  INodePropertyOptions,
} from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';
import { extractArray } from '../../../helpers/response.convert';
import { loadDropdown, searchResourceLocator } from '../../../helpers/searchHelper';

async function fetchUsers(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const response = await apiRequest.call(this, 'GET', '/users', {}, { page: 1, limit: 200 });
  const items: any[] = extractArray(response, 'users');

  return items
    .map((it: any) => ({
      name: (it?.Email ?? it?.email ?? ((it?.FirstName || it?.firstName || '') + ' ' + (it?.LastName || it?.lastName || '')).trim()) || ('User ' + (it?.UserId ?? it?.userId ?? '')),
      value: it?.userId ?? it?.id,
    }))
    .filter((option) => option.value !== undefined && option.value !== null && option.value !== '');
}

export async function loadUsersForDropdown(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  return loadDropdown.call(this, fetchUsers);
}

export async function searchUsersForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  return searchResourceLocator.call(this, fetchUsers, filter);
}
