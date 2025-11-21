import {
  ILoadOptionsFunctions,
  INodeListSearchResult,
  INodePropertyOptions,
} from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';
import { extractArray } from '../../../helpers/response.convert';
import { loadDropdown, searchResourceLocator } from '../../../helpers/searchHelper';

async function fetchTags(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const response = await apiRequest.call(this, 'GET', '/tags', {}, { page: 1, limit: 200 });
  const tags: any[] = extractArray(response, 'tags');

  return tags
    .map((tag: any) => {
      const value = tag?.TagID ?? tag?.tagId ?? tag?.Id ?? tag?.id;
      const name = tag?.Title ?? tag?.title ?? `Tag - ${value ?? ''}`;
      return { name, value } as INodePropertyOptions;
    })
    .filter((option) => option.value !== undefined && option.value !== null && option.value !== '');
}

export async function loadTagsForIdDropdown(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  return loadDropdown.call(this, fetchTags);
}

export async function searchTagsForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  return searchResourceLocator.call(this, fetchTags, filter);
}


