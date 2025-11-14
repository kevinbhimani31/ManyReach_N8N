import { ILoadOptionsFunctions,INodePropertyOptions,} from 'n8n-workflow';
import { loadDropdown, searchResourceLocator } from '../../../helpers/searchHelper';
import { apiRequest } from '../../../helpers/apiRequest';
import { extractArray } from '../../../helpers/response.convert';

async function fetchUsers
(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> 

{
  const response = await apiRequest.call(this, 'GET', '/users', {}, { limit: 200 });

  let users: any[] = extractArray (response, 'users');

  return users.map((user: any) => ({
    name: user.Email ?? user.email ?? `User ${user.UserId ?? user.userId}`,
    value: user.UserId ?? user.userId ?? user.userid,
  })).filter((option) => option.value !== undefined && option.value !== null && option.value !== '');
  
}

export async function loadUsersForDropdown
(
  this: ILoadOptionsFunctions,
) 
{
  return loadDropdown.call(this, fetchUsers);
}

export async function searchUsersForResourceLocator
(
  this: ILoadOptionsFunctions,
  filter?: string,
) 
{
  return searchResourceLocator.call(this, fetchUsers, filter);
}

