import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureGuid, extractStringId } from '../../helpers/validation';

export async function getUserById(this: IExecuteFunctions, index: number) {
  const rawId = this.getNodeParameter('userId', index) as any;
  const id = extractStringId(rawId, 'User ID');
  ensureGuid(id);



  const qs: Record<string, any> = {};


  const body: Record<string, any> = {};

  const response = await apiRequest.call(this, 'GET', `/users/${id}`, body, qs);

  return response;
}
