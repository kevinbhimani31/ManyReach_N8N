import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureId, extractNumericId } from '../../helpers/validation';

export async function getProspectById(this: IExecuteFunctions, index: number) {
  const rawId = this.getNodeParameter('prospectId', index) as any;
  const id = extractNumericId(rawId, 'Prospect ID');
  ensureId(id);

  const include = this.getNodeParameter('include', index, []) as string[];
  const qs: Record<string, any> = {};
  if (Array.isArray(include) && include.length > 0) qs.include = include.join(',');

  const response = await apiRequest.call(this, 'GET', `/prospects/${id}`, {}, qs);

  if (!response) {
    throw new Error(`Prospect with ID ${id} not found`);
  }

  return response;
}


