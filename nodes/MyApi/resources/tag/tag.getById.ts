import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureId, extractNumericId } from '../../helpers/validation';

export async function getTagById(this: IExecuteFunctions, index: number) {
  const rawId = this.getNodeParameter('tagId', index) as any;
  const id = extractNumericId(rawId, 'Tag ID');
  ensureId(id);

  // Optional include support in future: const include = this.getNodeParameter('include', index, []) as string[];
  // const qs = Array.isArray(include) && include.length > 0 ? { include: include.join(',') } : {};

  const response = await apiRequest.call(this, 'GET', `/tags/${id}`);

  if (!response) {
    throw new Error(`Tag with ID ${id} not found`);
  }

  return response;
}


