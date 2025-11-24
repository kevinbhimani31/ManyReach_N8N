import {
  ILoadOptionsFunctions,
  INodeListSearchResult,
  INodePropertyOptions,
} from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';
import { extractArray } from '../../../helpers/response.convert';
import { loadDropdown, searchResourceLocator } from '../../../helpers/searchHelper';

async function fetchProspects(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const response = await apiRequest.call(this, 'GET', '/prospects', {}, { page: 1, limit: 200 });
  const prospects: any[] = extractArray(response, 'prospects');

  return prospects
    .map((p: any) => {
      const value =
        p?.ProspectId ?? p?.prospectId ?? 0;
      const name =
        (p?.Email ?? p?.email ?? [p?.firstName, p?.lastName].filter(Boolean).join(' ')) || `Prospect ${value ?? ''}`;
      return { name, value } as INodePropertyOptions;
    })
    .filter((option) => option.value !== undefined && option.value !== null && option.value !== '');
}

export async function loadProspectsForIdDropdown(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  return loadDropdown.call(this, fetchProspects);
}

export async function searchProspectsForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  return searchResourceLocator.call(this, fetchProspects, filter);
}


