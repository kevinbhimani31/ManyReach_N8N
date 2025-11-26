import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureId, extractNumericId } from '../../helpers/validation';

export async function getListById(this: IExecuteFunctions, index: number) {
  const rawId = this.getNodeParameter('listId', index) as any;
  const id = extractNumericId(rawId, 'List ID');
  ensureId(id);

  const response = await apiRequest.call(this, 'GET', `/lists/${id}`);

  if (!response) {
    throw new Error(`List with ID ${id} not found`);
  }

  return response;
}

