import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureId } from '../../helpers/validation';

export async function getClientspaceById(this: IExecuteFunctions, index: number) {
  const id = this.getNodeParameter('clientspaceId', index, 0) as number;
  ensureId(id);

  const response = await apiRequest.call(this, 'GET', `/clientspaces/${id}`);

  if (!response) {
    throw new Error(`Clientspace with ID ${id} not found`);
  }

  return response;
}
