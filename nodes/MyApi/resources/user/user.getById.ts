import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureGuid } from '../../helpers/validation';

export async function getUserById(this: IExecuteFunctions, index: number) {
  const id = this.getNodeParameter('userId', index, '') as string;
  ensureGuid(id);

  const response = await apiRequest.call(this, 'GET', `/users/${id}`);

  if (!response) {
    throw new Error(`User with ID ${id} not found`);
  }

  return response;
}
