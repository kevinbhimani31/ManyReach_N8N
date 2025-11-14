import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractArray } from '../../helpers/response.convert';

export async function loadListsForDropdown(
  this: ILoadOptionsFunctions
): Promise<INodePropertyOptions[]> {

  const response = await apiRequest.call(this, 'GET', '/lists');
  let lists: any[] = extractArray(response, 'lists');
  return lists.map((list: any) => ({
    name: list.Title ?? list.title ?? list.Name,
    value: list.ListId ?? list.listId ?? list.id,
  }));
  
}
