import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureGuid } from '../../helpers/validation';

export async function deleteUser(this: IExecuteFunctions, index: number) {
  const id = this.getNodeParameter('userId', index, '') as string;
  ensureGuid(id);

  // depending on API semantics, you may do soft-delete or hard-delete
  const response = await apiRequest.call(this, 'DELETE', `/users/${id}`);

  // If API returns no content, return success body
  return response ?? { success: true, id };
}
