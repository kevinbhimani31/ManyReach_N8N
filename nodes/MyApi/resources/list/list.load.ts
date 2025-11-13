import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function loadListsForDropdown(
  this: ILoadOptionsFunctions
): Promise<INodePropertyOptions[]> {

  const response = await apiRequest.call(this, 'GET', '/lists');
  let lists: any[] = [];

  if (Array.isArray(response)) {
    lists = response;
  }
  else if (Array.isArray(response?.data)) {
    lists = response.data;
  }
  else if (Array.isArray(response?.items)) {
    lists = response.items;
  }
  else if (Array.isArray(response?.records)) {
    lists = response.records;
  }
  else {
    throw new Error('Unexpected API response format for /lists');
  }
//  console.log('Loaded lists for dropdown:', lists);
  return lists.map((list: any) => ({
    name: list.Title ?? list.title ?? list.Name,
    value: list.ListId ?? list.listId ?? list.id,
  }));
}
