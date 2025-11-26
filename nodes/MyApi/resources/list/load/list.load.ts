import {
  ILoadOptionsFunctions,
  INodeListSearchResult,
  INodePropertyOptions,
} from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';
import { extractArray } from '../../../helpers/response.convert';
import { loadDropdown, searchResourceLocator } from '../../../helpers/searchHelper';

async function fetchLists(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const response = await apiRequest.call(this, 'GET', '/lists', {}, { page: 1, limit: 200 });
  const lists: any[] = extractArray(response, 'lists');

  return lists
    .map((list: any) => {
      const value = list?.ListId ?? list?.listId ?? list?.id;
      const name = list?.Title ?? list?.title ?? list?.Name ?? `List ${value ?? ''}`;
      return { name, value } as INodePropertyOptions;
    })
    .filter((option) => option.value !== undefined && option.value !== null && option.value !== '');
}

export async function loadListsForDropdown(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  return loadDropdown.call(this, fetchLists);
}

export async function searchListsForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  return searchResourceLocator.call(this, fetchLists, filter);
}
