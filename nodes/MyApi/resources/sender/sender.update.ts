import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractNumericId, ensureId } from '../../helpers/validation';

export async function updateSender(this: IExecuteFunctions, index: number) {
  const rawId = this.getNodeParameter('senderId', index) as any;
  const id = extractNumericId(rawId, 'Sender ID');
  ensureId(id);
  const FirstName = this.getNodeParameter('FirstName', index) as string;

  const body: any = {};
  if (FirstName !== undefined && FirstName !== '') {
    body.FirstName = FirstName.trim();
  }

  const updateFields = this.getNodeParameter('updateFields', index, {}) as any;
  Object.assign(body, updateFields);

  const response = await apiRequest.call(this, 'PATCH', `/senders/${id}`, body);

  if (!response) {
    throw new Error('Failed to update sender: Empty response from API');
  }

  return response;
}
