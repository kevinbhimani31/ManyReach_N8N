import {
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
  INodePropertyOptions,
} from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';

async function fetchUsers(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const response = await apiRequest.call(this, 'GET', '/users', {}, { limit: 200 });

  let users: any[] = [];

  if (Array.isArray(response)) {
    users = response;
  } else if (Array.isArray(response?.data)) {
    users = response.data;
  } else if (Array.isArray(response?.items)) {
    users = response.items;
  } else if (Array.isArray(response?.records)) {
    users = response.records;
  } else {
    throw new Error('Unexpected API response format for /users');
  }

  return users.map((user: any) => ({
    name: user.Email ?? user.email ?? `User ${user.UserId ?? user.userId}`,
    value: user.UserId ?? user.userId ?? user.userid,
  })).filter((option) => option.value !== undefined && option.value !== null && option.value !== '');
}

export async function loadUsersForDropdown(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  return fetchUsers.call(this);
}

export async function searchUsersForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const options = await fetchUsers.call(this);

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

