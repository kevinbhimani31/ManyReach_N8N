import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureId, extractNumericId } from '../../helpers/validation';

export async function deleteSender(this: IExecuteFunctions, index: number) {
  const rawId = this.getNodeParameter('senderId', index) as any;
  const id = extractNumericId(rawId, 'Sender ID');
  ensureId(id);

  const response = await apiRequest.call(this, 'DELETE', `/senders/${id}`);

  // Return success if API responds with no content
  return response ?? { success: true, id };
}


