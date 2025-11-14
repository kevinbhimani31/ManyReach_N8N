import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureId, extractNumericId } from '../../helpers/validation';

export async function getClientspaceById(this: IExecuteFunctions, index: number) {
  const rawId = this.getNodeParameter('clientspaceId', index) as any;
  const id = extractNumericId(rawId, 'Clientspace ID');
  ensureId(id);

  const response = await apiRequest.call(this, 'GET', `/clientspaces/${id}`);

  if (!response) {
    throw new Error(`Clientspace with ID ${id} not found`);
  }

  return response;
}
