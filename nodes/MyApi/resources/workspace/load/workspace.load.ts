import {
  ILoadOptionsFunctions,
  INodeListSearchResult,
  INodePropertyOptions,
} from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';
import { extractArray } from '../../../helpers/response.convert';
import { loadDropdown, searchResourceLocator } from '../../../helpers/searchHelper';

async function fetchWorkspaces(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const response = await apiRequest.call(this, 'GET', '/workspaces', {}, { page: 1, limit: 200 });
  const workspaces: any[] = extractArray(response, 'workspaces');

  return workspaces
    .map((ws: any) => {
      const value = ws?.workspaceId ?? ws?.WorkspaceId ?? 0;
      const name =
        ws?.Title ?? ws?.title ?? `Workspace ${value ?? ''}`;
      return { name, value } as INodePropertyOptions;
    })
    .filter((option) => option.value !== undefined && option.value !== null && option.value !== '');
}

export async function loadWorkspacesForIdDropdown(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  return loadDropdown.call(this, fetchWorkspaces);
}

export async function searchWorkspacesForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  return searchResourceLocator.call(this, fetchWorkspaces, filter);
}


