import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractNumericId, ensureId } from '../../helpers/validation';

export async function getSenderById(this: IExecuteFunctions, index: number) {
  const rawId = this.getNodeParameter('senderId', index) as any;
  const id = extractNumericId(rawId, 'Sender ID');
  ensureId(id);

  const response = await apiRequest.call(this, 'GET', `/senders/${id}`);

  if (!response) {
    throw new Error(`Sender with ID ${id} not found`);
  }

  return response;
}
