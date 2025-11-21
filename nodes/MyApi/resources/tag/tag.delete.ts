import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureId, extractNumericId } from '../../helpers/validation';

export async function deleteTag(this: IExecuteFunctions, index: number) {
  const rawId = this.getNodeParameter('tagId', index) as any;
  const id = extractNumericId(rawId, 'Tag ID');
  ensureId(id);

  const force = this.getNodeParameter('force', index, false) as boolean;
  const qs = force ? { force: true } : {};

  const response = await apiRequest.call(this, 'DELETE', `/tags/${id}`, {}, qs);

  return response ?? { success: true, id };
}


