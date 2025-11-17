import { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';
 
export async function loadWorkspacesForDropdown(this: ILoadOptionsFunctions) {
  const response = await apiRequest.call(this, 'GET', '/workspaces', {}, { limit: 10 });
  const items = response?.data ?? response ?? [];
  return items.map((item: any) => ({
    name: item.name || item.id,
    value: item.id,
  }));
}

export async function searchWorkspacesForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const qs = filter ? { search: filter } : {};
  const response = await apiRequest.call(this, 'GET', '/workspaces', {}, qs);
  const items = response?.data ?? response ?? [];

  const results = items.map((item: any) => ({
    name: item.name || item.id,
    value: item.id,
  }));

  return {
    results,
  };
  
}
